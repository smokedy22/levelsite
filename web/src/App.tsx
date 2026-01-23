import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import PillNav from "./components/PillNav";
import "./components/PillNav.css";
import "./styles.css";
import "./components/LiquidChrome.css";
import LiquidChrome from "./components/LiquidChrome";
import PricingCards from "./components/PricingCards";
import CoachesCards from "./components/CoachesCards";
import Schedule from "./components/Schedule";
import TrainingsPage from "./components/TrainingsPage";

const navItems = [
    { label: "Главная", href: "/" },
    { label: "Расписание", href: "/schedule" },
    { label: "Абонементы", href: "/pricing" },
    { label: "Тренеры", href: "/coaches" },
    { label: "Тренировки", href: "/trainings" }
];

function Shell({ children }: { children: React.ReactNode }) {
    const { pathname } = useLocation();

    return (
        <div className="page">
            <PillNav
                items={navItems}
                activeHref={pathname}
                baseColor="transparent"
                pillColor="transparent"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#ffffff"
            />

            // В вашем App.tsx обновите использование LiquidChrome:
            <LiquidChrome
                baseColor={[0.03, 0.03, 0.035]}
                highlightColor={[1, 1, 1]}
                speed={0.24}
                amplitude={0.10}
                frequencyX={2.6}
                frequencyY={3.0}
                interactive={true}
                className="site-liquid"
            />

            <div className="main-content">
                {children}
            </div>

            <footer className="footer">
                <div className="grid">
                    <div>
                        <h4>LEVEL — Гомель</h4>
                        <p>Речицкий проспект, 108А (2 этаж)</p>
                        <p>+375 25 955-98-98</p>

                    </div>
                    <div>
                        <small>© {new Date().getFullYear()} LEVEL. Сделано с ❤️</small>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Shell>
                        <header className="hero">
                            <div className="hero-content">
                                <h1>LEVEL — ЭТО УРОВЕНЬ</h1>
                                <p>
                                    Групповые тренировки, более 25 направлений, волейбол,
                                    детские занятия.
                                </p>

                                <div className="work-hours">
                                    <div className="work-hours-header">
                                        <div className="work-hours-icon">🕐</div>
                                        <h3>Режим работы</h3>
                                    </div>
                                    <div className="work-hours-content">
                                        <div className="work-hours-grid">
                                            <div className="work-hours-item">
                                                <span className="work-hours-label">Будни:</span>
                                                <span className="work-hours-time">с 9:00 до 21:00</span>
                                            </div>
                                            <div className="work-hours-item">
                                                <span className="work-hours-label">Выходные:</span>
                                                <span className="work-hours-time">с 10:00 до 19:00</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="hero-buttons">
                                    <a
                                        className="btn btn-attract btn-ruby"
                                        href="https://www.instagram.com/levelgomel/"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Групповые тренировки
                                    </a>
                                    <a
                                        className="btn btn-attract btn-secondary"
                                        href="https://www.instagram.com/sc_level/"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Волейбол
                                    </a>
                                </div>
                            </div>
                            <div className="hero-overlay-dim" aria-hidden="true" />
                        </header>
                    </Shell>
                }
            />

            <Route
                path="/schedule"
                element={
                    <Shell>
                        <Schedule />
                    </Shell>
                }
            />

            <Route
                path="/pricing"
                element={
                    <Shell>
                        <div style={{ padding: "2.5rem 1.5rem 3rem" }}>
                            <PricingCards />
                        </div>
                    </Shell>
                }
            />

            <Route
                path="/coaches"
                element={
                    <Shell>
                        <div style={{ padding: "6rem 1.5rem" }}>
                            <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
                                Наши тренеры
                            </h2>
                            <CoachesCards />
                        </div>
                    </Shell>
                }
            />

            <Route
                path="/trainings"
                element={
                    <Shell>
                        <div style={{ padding: "6rem 1.5rem" }}>
                            <TrainingsPage />
                        </div>
                    </Shell>
                }
            />

            <Route
                path="*"
                element={
                    <Shell>
                        <div style={{ padding: "6rem 1.5rem" }}>
                            <h2>Скоро здесь будет контент</h2>
                            <Link to="/">← На главную</Link>
                        </div>
                    </Shell>
                }
            />
        </Routes>
    );
}