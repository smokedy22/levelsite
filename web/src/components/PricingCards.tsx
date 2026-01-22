import React, { useState } from "react";
import "./PricingCards.css";

interface Subscription {
    id: number;
    name: string;
    price: string;
    perSession?: string;
    category: 'single' | 'pension' | 'volleyball' | 'fitness';
    featured?: boolean;
}

interface Category {
    id: string;
    label: string;
    title: string;
    subscriptions: Subscription[];
}

const PricingCards: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('all');

    const categoriesData: Category[] = [
        {
            id: 'single',
            label: 'Разовое посещение',
            title: 'РАЗОВОЕ ПОСЕЩЕНИЕ',
            subscriptions: [
                { id: 1, name: "Пробная тренировка", price: "БЕСПЛАТНО", perSession: "при покупке абонемента", category: 'single' },
                { id: 2, name: "Пробная тренировка", price: "10 р", category: 'single' },
                { id: 3, name: "Групповая тренировка", price: "17 р", perSession: "волейбол / фитнес", category: 'single' }
            ]
        },
        {
            id: 'pension',
            label: 'Для пенсионеров',
            title: 'АБОНЕМЕНТ ДЛЯ ПЕНСИОНЕРОВ',
            subscriptions: [
                { id: 4, name: "4 тренировки", price: "50 р", perSession: "12,5 р / тренировка", category: 'pension' },
                { id: 5, name: "8 тренировок", price: "88 р", perSession: "11 р / тренировка", category: 'pension' },
                { id: 6, name: "12 тренировок", price: "114 р", perSession: "9,5 р / тренировка", category: 'pension', featured: true }
            ]
        },
        {
            id: 'volleyball',
            label: 'Волейбол',
            title: 'АБОНЕМЕНТ «ВОЛЕЙБОЛ»',
            subscriptions: [
                { id: 7, name: "4 тренировки", price: "64 р", perSession: "16 р / тренировка", category: 'volleyball' },
                { id: 8, name: "8 тренировок", price: "114 р", perSession: "14,2 р / тренировка", category: 'volleyball' },
                { id: 9, name: "12 тренировок", price: "158 р", perSession: "13,1 р / тренировка", category: 'volleyball', featured: true }
            ]
        },
        {
            id: 'fitness',
            label: 'Фитнес',
            title: 'АБОНЕМЕНТ «ФИТНЕС»',
            subscriptions: [
                { id: 10, name: "4 тренировки", price: "60 р", perSession: "15 р / тренировка", category: 'fitness' },
                { id: 11, name: "8 тренировок", price: "99 р", perSession: "12,3 р / тренировка", category: 'fitness' },
                { id: 12, name: "12 тренировок", price: "124 р", perSession: "10,3 р / тренировка", category: 'fitness', featured: true }
            ]
        }
    ];

    const filterButtons = [
        { id: 'all', label: 'Все абонементы' },
        { id: 'single', label: 'Разовое посещение' },
        { id: 'pension', label: 'Для пенсионеров' },
        { id: 'volleyball', label: 'Волейбол' },
        { id: 'fitness', label: 'Фитнес' }
    ];

    const displayData = activeCategory === 'all'
        ? categoriesData
        : [categoriesData.find(cat => cat.id === activeCategory)!];

    return (
        <div className="pricing-container">

            {/* Фильтры */}
            <div className="hero-buttons pricing-filter-buttons">
                {filterButtons.map(btn => (
                    <button
                        key={btn.id}
                        className={`btn btn-attract ${activeCategory === btn.id ? 'btn-ruby' : 'btn-secondary'}`}
                        onClick={() => setActiveCategory(btn.id)}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>

            {displayData.map(category => (
                <div key={category.id} className="pricing-section">
                    <h2 className="pricing-title">{category.title}</h2>

                    {/* Liquid Glass description - одинаковый для всех категорий */}
                    <div className="pricing-description glass-panel">
                        Срок действия любого абонемента — 45 дней
                        <br />
                        <br />
                        Срок активации абонемента - 15 дней со дня покупки
                    </div>

                    <div className="pricing-table">
                        <div className="pricing-header-row">
                            <span></span>
                            <span>Цена</span>
                            <span>Цена за тренировку</span>
                        </div>

                        {category.subscriptions.map(sub => (
                            <div
                                key={sub.id}
                                className={`pricing-row ${sub.featured ? "featured-row" : ""}`}
                            >
                                <span className="row-name">
                                    {sub.name}
                                    {sub.perSession && (
                                        <small>{sub.perSession}</small>
                                    )}
                                </span>

                                <span className="row-price">{sub.price}</span>

                                <span className="row-per-session">
                                    {sub.perSession?.includes("р") ? sub.perSession : ""}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PricingCards;