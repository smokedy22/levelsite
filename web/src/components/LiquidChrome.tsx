import React, { useRef, useEffect, HTMLAttributes } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import "./LiquidChrome.css";

type Props = HTMLAttributes<HTMLDivElement> & {
    baseColor?: [number, number, number];
    highlightColor?: [number, number, number];
    speed?: number;
    amplitude?: number;
    frequencyX?: number;
    frequencyY?: number;
    interactive?: boolean;
};

const LiquidChrome: React.FC<Props> = ({
                                           baseColor = [0.03, 0.03, 0.035],
                                           highlightColor = [1, 1, 1],
                                           speed = 0.22,
                                           amplitude = 0.16,
                                           frequencyX = 3.2,
                                           frequencyY = 3.6,
                                           interactive = true,
                                           className,
                                           ...props
                                       }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const programRef = useRef<any | null>(null);
    const animRef = useRef<number | null>(null);
    const rendererRef = useRef<any | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const renderer = new Renderer({ antialias: true });
        rendererRef.current = renderer;
        const gl = (renderer.gl as any);

        if (typeof gl.clearColor === "function") {
            try { gl.clearColor(0, 0, 0, 0); } catch {}
        }

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
                uResolution: { value: new Float32Array([Math.max(1, gl.canvas.width || 1), Math.max(1, gl.canvas.height || 1), Math.max(1, (gl.canvas.width || 1) / (gl.canvas.height || 1))]) },
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

        // ensure canvas exists and sits behind content
        const maybeCanvas = gl.canvas;
        let appended: HTMLCanvasElement | null = null;
        if (maybeCanvas instanceof HTMLCanvasElement) {
            appended = maybeCanvas;
        } else {
            appended = document.createElement("canvas");
            try { if (gl) (gl as any).canvas = appended; } catch {}
        }

        appended.style.position = "fixed";
        appended.style.inset = "0";
        appended.style.width = "100%";
        appended.style.height = "100%";
        appended.style.display = "block";
        appended.style.objectFit = "cover";
        appended.style.pointerEvents = "none";
        appended.style.zIndex = "0";
        if (!appended.parentElement) document.body.appendChild(appended);

        // raise content
        const siteMain = document.querySelector(".site-main") as HTMLElement | null;
        if (siteMain) { siteMain.style.position = "relative"; siteMain.style.zIndex = "2"; }

        const resize = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const dpr = Math.max(1, window.devicePixelRatio || 1);
            const w = Math.max(1, Math.floor(vw * dpr));
            const h = Math.max(1, Math.floor(vh * dpr));
            try { renderer.setSize(w, h); } catch { try { (renderer as any).setSize(w, h); } catch {} }
            if (appended) { appended.style.width = vw + "px"; appended.style.height = vh + "px"; }
            const res = program.uniforms.uResolution.value as Float32Array;
            res[0] = (gl && gl.canvas && gl.canvas.width) || w;
            res[1] = (gl && gl.canvas && gl.canvas.height) || h;
            res[2] = res[0] / Math.max(1, res[1]);
        };

        window.addEventListener("resize", resize);
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

        if (interactive) {
            window.addEventListener("mousemove", onMouse);
            window.addEventListener("touchmove", onTouch, { passive: true } as EventListenerOptions);
        }

        const animate = (t: number) => {
            program.uniforms.uTime.value = t * 0.001 * speed;
            try { renderer.render({ scene: mesh }); } catch { try { (renderer as any).render({ scene: mesh }); } catch {} }
            animRef.current = requestAnimationFrame(animate);
        };
        animRef.current = requestAnimationFrame(animate);

        return () => {
            if (animRef.current !== null) cancelAnimationFrame(animRef.current);
            window.removeEventListener("resize", resize);
            if (interactive) {
                window.removeEventListener("mousemove", onMouse);
                window.removeEventListener("touchmove", onTouch);
            }
            try { if (appended && appended.parentElement) appended.parentElement.removeChild(appended); } catch {}
            const ext = (gl as any).getExtension && (gl as any).getExtension("WEBGL_lose_context");
            if (ext && typeof ext.loseContext === "function") try { ext.loseContext(); } catch {}
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // update uniforms when props change
    useEffect(() => {
        if (programRef.current && programRef.current.uniforms) {
            if (programRef.current.uniforms.uBaseColor) programRef.current.uniforms.uBaseColor.value = new Float32Array(baseColor);
            if (programRef.current.uniforms.uHighlightColor) programRef.current.uniforms.uHighlightColor.value = new Float32Array((props as any).highlightColor || [1,1,1]);
        }
    }, [baseColor, props]);

    return <div ref={containerRef} className={`liquidChrome-container ${className ?? ""}`} {...props} />;
};

export default LiquidChrome;
