import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import PillNav from "./components/PillNav";
import "./components/PillNav.css";
import "./styles.css";
import "./components/LiquidChrome.css";
import LiquidChrome from "./components/LiquidChrome";
import Stories from "./components/Stories";
import PricingCards from "./components/PricingCards";
import CoachesCards from "./components/CoachesCards";
import Schedule from "./components/Schedule";

const navItems = [
    { label: "Главная", href: "/" },
    { label: "Расписание", href: "/schedule" },
    { label: "Абонементы", href: "/pricing" },
    { label: "Тренеры", href: "/coaches" },
    { label: "Контакты", href: "/contacts" }
];

function Shell({ children }: { children: React.ReactNode }) {
    const { pathname } = useLocation();
    const pageClass = pathname === "/" ? "page no-scroll" : "page";

    return (
        <div className={pageClass}>
            <PillNav
                items={navItems}
                activeHref={pathname}
                baseColor="transparent"
                pillColor="transparent"
                hoveredPillTextColor="#ffffff"
                pillTextColor="#ffffff"
            />

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

            {children}

            <footer className="footer">
                <div className="grid">
                    <div>
                        <h4>LEVEL — Гомель</h4>
                        <p>Речицкий проспект, 108А (2 этаж)</p>
                        <p>+375 25 955-98-98</p>
                        <p>
                            <a href="https://www.instagram.com/levelgomel/" target="_blank" rel="noreferrer">
                                Instagram @levelgomel
                            </a>
                        </p>
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
                                    Групповые и персональные тренировки, более 25 направлений,
                                    детские занятия.
                                </p>
                                <a
                                    className="btn btn-attract btn-ruby"
                                    href="https://www.instagram.com/levelgomel/"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Напишите Нам!
                                </a>
                            </div>
                            <div className="hero-overlay-dim" aria-hidden="true" />
                        </header>
                        <section className="stories-wrap">
                            <Stories />
                        </section>
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
                        <div style={{ padding: "6rem 1.5rem" }}>
                            <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Абонементы</h2>
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
                            <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>Наши тренеры</h2>
                            <CoachesCards />
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
