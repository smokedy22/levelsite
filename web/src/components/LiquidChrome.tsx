import React, { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

type LiquidChromeProps = {
    baseColor?: [number, number, number];
    highlightColor?: [number, number, number];
    speed?: number;
    amplitude?: number;
    frequencyX?: number;
    frequencyY?: number;
    interactive?: boolean;
    className?: string;
};

const LiquidChrome: React.FC<LiquidChromeProps> = ({
                                                       baseColor = [0.03, 0.03, 0.035],
                                                       highlightColor = [1, 1, 1],
                                                       speed = 0.22,
                                                       amplitude = 0.16,
                                                       frequencyX = 3.2,
                                                       frequencyY = 3.6,
                                                       interactive = true,
                                                       className = "",
                                                   }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const programRef = useRef<any | null>(null);
    const animRef = useRef<number | null>(null);
    const rendererRef = useRef<any | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const renderer = new Renderer({
            antialias: true,
            powerPreference: 'high-performance'
        });
        rendererRef.current = renderer;
        const gl = renderer.gl;

        // Создаем canvas внутри контейнера
        const canvas = gl.canvas;
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
        canvas.style.display = 'block';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        canvas.style.backgroundColor = 'transparent';

        // Добавляем canvas в контейнер компонента
        container.appendChild(canvas);

        const vertex = `
            attribute vec2 position;
            attribute vec2 uv;
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fragment = `
            precision highp float;
            uniform float uTime;
            uniform vec3 uResolution;
            uniform vec3 uBaseColor;
            uniform vec3 uHighlightColor;
            uniform float uAmplitude;
            uniform float uFrequencyX;
            uniform float uFrequencyY;
            uniform vec2 uMouse;
            varying vec2 vUv;

            float hash21(vec2 p) {
                p = fract(p * vec2(127.1, 311.7));
                p = p + dot(p, p + 34.5);
                return fract(p.x * p.y);
            }

            vec4 renderImage(vec2 uvCoord) {
                vec2 fragCoord = uvCoord * uResolution.xy;
                vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

                // layered wave detail
                for (float i = 1.0; i < 10.0; i++){
                    uv.x += (uAmplitude / (i*0.8)) * cos(i * uFrequencyX * uv.y + uTime * 0.9 + uMouse.x * 3.14159);
                    uv.y += (uAmplitude / (i*0.8)) * cos(i * uFrequencyY * uv.x + uTime * 0.9 + uMouse.y * 3.14159);
                }

                vec2 diff = (uvCoord - uMouse);
                float dist = length(diff);
                float falloff = exp(-dist * 16.0);
                float ripple = sin(10.0 * dist - uTime * 2.0) * 0.018;
                uv += (diff / (dist + 0.0001)) * ripple * falloff;

                // darker base with slight contrast boost
                float tone = 0.35 + 0.65 * sin(uTime * 0.28 - uv.x * 1.6 - uv.y * 1.1 + hash21(uvCoord) * 2.0);
                vec3 base = uBaseColor * mix(0.75, 1.05, tone);

                // tighter, stronger highlights
                float radial = smoothstep(0.97, 0.0, length(uv) * 0.45);
                float fres = pow(clamp(1.0 - length(uv) * 0.55, 0.0, 1.0), 2.6);
                float gloss = pow(clamp(1.0 - length(uv) * 0.42, 0.0, 1.0), 10.0);

                vec3 highlight = uHighlightColor * (0.045 * fres + 0.09 * radial * tone + 0.18 * gloss * falloff);

                // combine with base and a mild contrast lift
                vec3 color = base * 0.88 + highlight;
                color = pow(clamp(color, 0.0, 1.0), vec3(0.95)); // slight gamma tweak
                color = clamp(color, 0.0, 1.0);
                return vec4(color, 1.0);
            }

            void main() {
                vec4 col = vec4(0.0);
                int samples = 0;
                for (int i = -1; i <= 1; i++){
                    for (int j = -1; j <= 1; j++){
                        vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
                        col += renderImage(vUv + offset);
                        samples++;
                    }
                }
                gl_FragColor = col / float(samples);
            }
        `;

        const geometry = new Triangle(gl);
        const program = new Program(gl, {
            vertex,
            fragment,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Float32Array([window.innerWidth, window.innerHeight, window.innerWidth / window.innerHeight]) },
                uBaseColor: { value: new Float32Array(baseColor) },
                uHighlightColor: { value: new Float32Array(highlightColor) },
                uAmplitude: { value: amplitude },
                uFrequencyX: { value: frequencyX },
                uFrequencyY: { value: frequencyY },
                uMouse: { value: new Float32Array([0, 0]) }
            }
        });

        programRef.current = program;
        const mesh = new Mesh(gl, { geometry, program });

        const resize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const dpr = Math.min(2, window.devicePixelRatio || 1);

            try {
                renderer.setSize(width * dpr, height * dpr);
            } catch (e) {
                console.error('Error setting renderer size:', e);
            }

            if (canvas) {
                canvas.style.width = width + 'px';
                canvas.style.height = height + 'px';
            }

            const res = program.uniforms.uResolution.value as Float32Array;
            res[0] = width * dpr;
            res[1] = height * dpr;
            res[2] = width / Math.max(1, height);
        };

        // Устанавливаем начальный размер
        resize();

        const onMouse = (e: MouseEvent) => {
            const x = e.clientX / window.innerWidth;
            const y = 1 - e.clientY / window.innerHeight;
            const mu = program.uniforms.uMouse.value as Float32Array;
            mu[0] = Number.isFinite(x) ? x : 0;
            mu[1] = Number.isFinite(y) ? y : 0;
        };

        const onTouch = (e: TouchEvent) => {
            if (!e.touches.length) return;
            const t = e.touches[0];
            const x = t.clientX / window.innerWidth;
            const y = 1 - t.clientY / window.innerHeight;
            const mu = program.uniforms.uMouse.value as Float32Array;
            mu[0] = Number.isFinite(x) ? x : 0;
            mu[1] = Number.isFinite(y) ? y : 0;
        };

        const handleResize = () => {
            requestAnimationFrame(resize);
        };

        window.addEventListener('resize', handleResize, { passive: true });

        if (interactive) {
            window.addEventListener('mousemove', onMouse, { passive: true });
            window.addEventListener('touchmove', onTouch, { passive: true });
            window.addEventListener('touchstart', onTouch, { passive: true });
        }

        let lastTime = 0;
        const animate = (time: number) => {
            const delta = time - lastTime;
            lastTime = time;

            if (program && program.uniforms && program.uniforms.uTime) {
                program.uniforms.uTime.value = (program.uniforms.uTime.value || 0) + (delta * 0.001 * speed);
            }

            try {
                renderer.render({ scene: mesh });
            } catch (e) {
                console.error('Error rendering:', e);
            }

            animRef.current = requestAnimationFrame(animate);
        };

        animRef.current = requestAnimationFrame((time) => {
            lastTime = time;
            animate(time);
        });

        return () => {
            if (animRef.current !== null) {
                cancelAnimationFrame(animRef.current);
            }

            window.removeEventListener('resize', handleResize);

            if (interactive) {
                window.removeEventListener('mousemove', onMouse);
                window.removeEventListener('touchmove', onTouch);
                window.removeEventListener('touchstart', onTouch);
            }

            try {
                if (canvas && canvas.parentNode === container) {
                    container.removeChild(canvas);
                }
            } catch (e) {
                console.error('Error removing canvas:', e);
            }

            try {
                const ext = gl.getExtension('WEBGL_lose_context');
                if (ext && typeof ext.loseContext === 'function') {
                    ext.loseContext();
                }
            } catch (e) {
                console.error('Error losing WebGL context:', e);
            }
        };
    }, []);

    useEffect(() => {
        if (programRef.current && programRef.current.uniforms) {
            if (programRef.current.uniforms.uBaseColor) {
                programRef.current.uniforms.uBaseColor.value = new Float32Array(baseColor);
            }
            if (programRef.current.uniforms.uHighlightColor) {
                programRef.current.uniforms.uHighlightColor.value = new Float32Array(highlightColor);
            }
            if (programRef.current.uniforms.uAmplitude) {
                programRef.current.uniforms.uAmplitude.value = amplitude;
            }
            if (programRef.current.uniforms.uFrequencyX) {
                programRef.current.uniforms.uFrequencyX.value = frequencyX;
            }
            if (programRef.current.uniforms.uFrequencyY) {
                programRef.current.uniforms.uFrequencyY.value = frequencyY;
            }
        }
    }, [baseColor, highlightColor, amplitude, frequencyX, frequencyY]);

    return (
        <div
            ref={containerRef}
            className={`site-liquid ${className}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 0,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}
        />
    );
};

export default LiquidChrome;