import React, { useEffect, useRef, useState } from "react";

type Story = {
    id: string;
    title: string;
    type: "image" | "video";
    src: string;
    duration: number; // ms
};

export default function Stories() {
    // Вместо import – строим URL на картинку в dist/stories
    // путь '../../dist/stories/1.jpg' берётся относительно этого файла
    const staticStories: Story[] = [
        {
            id: "1",
            title: "Фото 1",
            type: "image",
            src: new URL("../../dist/stories/1.jpg", import.meta.url).href,
            duration: 4000,
        },
        {
            id: "2",
            title: "Фото 2",
            type: "image",
            src: new URL("../../dist/stories/2.jpg", import.meta.url).href,
            duration: 4000,
        },
        {
            id: "3",
            title: "Фото 3",
            type: "image",
            src: new URL("../../dist/stories/3.jpg", import.meta.url).href,
            duration: 4000,
        },
    ];

    const [stories] = useState<Story[]>(staticStories);
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const timerRef = useRef<number | null>(null);
    const progressRef = useRef<HTMLDivElement | null>(null);
    const holdRef = useRef(false);

    // Запускаем автоматический переход
    useEffect(() => {
        if (!open) return;
        startTimer();
        return stopTimer;
    }, [open, index]);

    function startTimer() {
        stopTimer();
        const d = stories[index].duration;
        timerRef.current = window.setTimeout(next, d);
        animateProgress(d);
    }

    function stopTimer() {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (progressRef.current) progressRef.current.style.transform = "scaleX(0)";
    }

    function next() {
        if (index < stories.length - 1) setIndex(i => i + 1);
        else setOpen(false);
    }

    function prev() {
        if (index > 0) setIndex(i => i - 1);
    }

    function onHoldStart() {
        holdRef.current = true;
        stopTimer();
    }

    function onHoldEnd() {
        if (holdRef.current) {
            holdRef.current = false;
            startTimer();
        }
    }

    function animateProgress(ms: number) {
        if (!progressRef.current) return;
        const el = progressRef.current;
        el.style.transition = "none";
        el.style.transformOrigin = "left";
        el.style.transform = "scaleX(0)";
        requestAnimationFrame(() => {
            el.style.transition = `transform ${ms}ms linear`;
            el.style.transform = "scaleX(1)";
        });
    }

    return (
        <>
            <div className="stories-strip">
                {stories.map((s, i) => (
                    <button
                        key={s.id}
                        className="story-chip"
                        onClick={() => {
                            setIndex(i);
                            setOpen(true);
                        }}
                    >
                        <span className="ring" />
                        <span className="chip-title">{s.title}</span>
                    </button>
                ))}
            </div>

            {open && (
                <div
                    className="story-modal"
                    onMouseDown={onHoldStart}
                    onMouseUp={onHoldEnd}
                    onTouchStart={onHoldStart}
                    onTouchEnd={onHoldEnd}
                >
                    <div className="story-top">
                        <div className="progress-bar">
                            {stories.map((_, i) => (
                                <div
                                    key={i}
                                    className={
                                        "progress-seg" +
                                        (i < index ? " done" : i === index ? " active" : "")
                                    }
                                >
                                    {i === index && (
                                        <div className="progress-fill" ref={progressRef} />
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            className="close"
                            onClick={() => setOpen(false)}
                            aria-label="Закрыть"
                        >
                            ×
                        </button>
                    </div>

                    <div
                        className="story-body"
                        onClick={e => {
                            const mid = e.currentTarget.clientWidth / 2;
                            if ((e.nativeEvent as MouseEvent).offsetX < mid) prev();
                            else next();
                        }}
                    >
                        <img src={stories[index].src} alt={stories[index].title} />
                        <div className="story-caption">
                            <h3>{stories[index].title}</h3>
                        </div>
                    </div>

                    <div className="story-nav">
                        <button onClick={prev} aria-label="Назад">
                            ←
                        </button>
                        <button onClick={next} aria-label="Вперёд">
                            →
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
