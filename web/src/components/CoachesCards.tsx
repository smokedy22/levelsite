import React from "react";
import "./CoachesCards.css";

type Coach = {
    name: string;
    role: string;
    src: string;
};

const coaches: Coach[] = [
    {
        name: "Ира",
        role: "Тренер групповых направлений",
        src: new URL("../../dist/coaches/ira.jpg", import.meta.url).href
    },
    {
        name: "Лера",
        role: "Тренер групповых направлений",
        src: new URL("../../dist/coaches/lera.jpg", import.meta.url).href
    },
    {
        name: "Катя",
        role: "Тренер групповых направлений",
        src: new URL("../../dist/coaches/katya.jpg", import.meta.url).href
    },
    {
        name: "Надя",
        role: "Хореограф",
        src: new URL("../../dist/coaches/nadya.jpg", import.meta.url).href
    },
    {
        name: "Марина",
        role: "Тренер групповых направлений",
        src: new URL("../../dist/coaches/marina.jpg", import.meta.url).href
    },
    {
        name: "Таня",
        role: "Хореограф",
        src: new URL("../../dist/coaches/tanya.jpg", import.meta.url).href
    },
    {
        name: "Руслан",
        role: "Тренер по волейболу",
        src: new URL("../../dist/coaches/ruslan.jpg", import.meta.url).href
    },
    {
        name: "Оля",
        role: "Тренер групповых направлений",
        src: new URL("../../dist/coaches/olya.jpg", import.meta.url).href
    }
];

export default function CoachesCards() {
    return (
        <div className="coaches-cards">
            {coaches.map((c) => (
                <div key={c.name} className="coach-card">
                    <img
                        className="coach-photo"
                        src={c.src}
                        alt={c.name}
                        loading="lazy"
                    />
                    <h3 className="coach-name">{c.name}</h3>
                    <p className="coach-role">{c.role}</p>
                </div>
            ))}
        </div>
    );
}
