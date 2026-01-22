import React from "react";
import "./CoachesCards.css";

import ira from "../assets/ira.jpg";
import lera from "../assets/lera.jpg";
import katya from "../assets/katya.jpg";
import nadya from "../assets/nadya.jpg";
import marina from "../assets/marina.jpg";
import tanya from "../assets/tanya.jpg";
import ruslan from "../assets/ruslan.jpg";
import olya from "../assets/olya.jpg";

type Coach = {
    name: string;
    role: string;
    src: string;
};

const coaches: Coach[] = [
    {
        name: "Ира",
        role: "Тренер групповых направлений",
        src: ira
    },
    {
        name: "Лера",
        role: "Тренер групповых направлений",
        src: lera
    },
    {
        name: "Катя",
        role: "Тренер групповых направлений",
        src: katya
    },
    {
        name: "Надя",
        role: "Хореограф",
        src: nadya
    },
    {
        name: "Марина",
        role: "Тренер групповых направлений",
        src: marina
    },
    {
        name: "Таня",
        role: "Хореограф",
        src: tanya
    },
    {
        name: "Руслан",
        role: "Тренер по волейболу",
        src: ruslan
    },
    {
        name: "Оля",
        role: "Тренер групповых направлений",
        src: olya
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
