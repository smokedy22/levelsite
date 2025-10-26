import React, { useRef } from "react";
import "./PricingCards.css";
import ElectricBorder from "./ElectricBorder";

interface Subscription {
    id: number;
    name: string;
    price: string;
    description: string;
    glowIntensity: number;
    glowColor: string;
}

const PricingCards: React.FC = () => {
    const cardsRef = useRef<Array<HTMLDivElement | null>>([]);

    const subscriptions: Subscription[] = [
        {
            id: 1,
            name: "Разовое посещение",
            price: "14 рублей",
            description: "Одно занятие в любом направлении",
            glowIntensity: 0.3,
            glowColor: "#8B4513"
        },
        {
            id: 2,
            name: "Абонемент на 4 занятия",
            price: "50 рублей",
            description: "Экономия 12 рублей",
            glowIntensity: 0.5,
            glowColor: "#C0C0C0"
        },
        {
            id: 3,
            name: "Абонемент на 8 занятий",
            price: "88 рублей",
            description: "Экономия 24 рублей",
            glowIntensity: 0.8,
            glowColor: "gold"
        },
        {
            id: 4,
            name: "Абонемент на 12 занятий",
            price: "114 рублей",
            description: "Экономия 54 рублей",
            glowIntensity: 1.2,
            glowColor: "#B0002A"
        }
    ];

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
        const card = cardsRef.current[index];
        if (!card) return;

        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const angleX = (y - centerY) / 20;
        const angleY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        card.style.boxShadow = `0 ${Math.abs(angleY) * 10}px ${Math.abs(angleY) * 20}px rgba(0, 0, 0, 0.3)`;
    };

    const handleMouseLeave = (index: number) => {
        const card = cardsRef.current[index];
        if (card) {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        }
    };

    return (
        <div className="pricing-container">
            <div className="cards-grid">
                {subscriptions.map((sub, index) => {
                    const vars: Record<string, string> = {
                        "--glow-color": sub.glowColor,
                        "--glow-intensity": String(sub.glowIntensity)
                    };


                    const isFeatured = sub.id === 4 || sub.price === "114 рублей";

                    const cardContent = (
                        <div
                            key={sub.id}
                            ref={(el: HTMLDivElement | null) => cardsRef.current[index] = el}
                            className={`pricing-card${isFeatured ? " featured" : ""}`}
                            onMouseMove={(e: React.MouseEvent<HTMLDivElement>) => handleMouseMove(e, index)}
                            onMouseLeave={() => handleMouseLeave(index)}
                            style={vars}
                        >
                            <div className="card-glow" />
                            <div className="card-content">
                                <h3>{sub.name}</h3>
                                <div className="price">{sub.price}</div>
                                <p>{sub.description}</p>
                                <button className="buy-btn">Купить</button>
                            </div>
                        </div>
                    );

                    if (isFeatured) {
                        return (
                            <ElectricBorder
                                key={sub.id}
                                color={sub.glowColor}
                                speed={1.2}
                                chaos={1.4}
                                thickness={3}
                                className="pricing-eb-wrapper featured-wrapper"
                                style={{ display: "block", borderRadius: 16 }}
                            >
                                {cardContent}
                            </ElectricBorder>
                        );
                    }

                    return cardContent;
                })}
            </div>
        </div>
    );
};

export default PricingCards;
