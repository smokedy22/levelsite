import React, { useRef, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./PillNav.css";
import logo from "../assets/logo.jpg";

type NavItem = {
    label: string;
    href: string;
};

interface PillNavProps {
    items: NavItem[];
    activeHref: string;
    className?: string;
    baseColor?: string;
    pillColor?: string;
    hoveredPillTextColor?: string;
    pillTextColor: string;
    onMobileMenuClick?: () => void;
}

const PillNav: React.FC<PillNavProps> = ({
                                             items,
                                             activeHref,
                                             className = "",
                                             baseColor = "#fff",
                                             pillColor = "#060010",
                                             hoveredPillTextColor = "#060010",
                                             pillTextColor,
                                             onMobileMenuClick
                                         }) => {
    const navRef = useRef<HTMLElement>(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isMobileView, setIsMobileView] = useState(false);
    const [logoClicked, setLogoClicked] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Определение мобильного вида
    useEffect(() => {
        const checkMobileView = () => {
            setIsMobileView(window.innerWidth <= 768);
        };

        checkMobileView();
        window.addEventListener('resize', checkMobileView);

        return () => {
            window.removeEventListener('resize', checkMobileView);
        };
    }, []);

    // Обработчик скролла
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Закрываем мобильное меню при изменении роута
    useEffect(() => {
        if (mobileMenuOpen) {
            handleCloseMenu();
        }
    }, [activeHref]);

    const toggleMobileMenu = () => {
        if (mobileMenuOpen) {
            handleCloseMenu();
        } else {
            setMobileMenuOpen(true);
            setIsClosing(false);
            if (onMobileMenuClick) {
                onMobileMenuClick();
            }
        }
    };

    const handleCloseMenu = () => {
        if (isMobileView && mobileMenuOpen) {
            setIsClosing(true);
            setTimeout(() => {
                setMobileMenuOpen(false);
                setIsClosing(false);
            }, 300);
        }
    };

    // Обработчик клика на логотип
    const handleLogoClick = (e: React.MouseEvent) => {
        if (isMobileView) {
            e.preventDefault();

            // Анимация клика
            setLogoClicked(true);
            setTimeout(() => setLogoClicked(false), 300);

            toggleMobileMenu();
        }
        // На десктопе стандартное поведение NavLink (переход на главную)
    };

    // Закрыть меню при клике вне его
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (isMobileView && mobileMenuOpen && navRef.current &&
                !navRef.current.contains(e.target as Node)) {
                handleCloseMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMobileView, mobileMenuOpen]);

    return (
        <div className={`pill-nav-container ${scrolled ? 'scrolled' : ''}`}>
            <nav
                ref={navRef}
                className={`pill-nav ${className} ${isMobileView ? 'mobile-view' : ''}`}
                aria-label="Primary navigation"
            >
                {/* Логотип */}
                <div className={`pill-logo ${logoClicked ? 'logo-clicked' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`}>
                    <NavLink
                        to="/"
                        onClick={handleLogoClick}
                        title={isMobileView ? "Открыть меню" : "Перейти на главную"}
                        aria-label={isMobileView ? "Открыть меню" : "Перейти на главную"}
                    >
                        <img src={logo} alt="Level" className="logo-img" />
                        {isMobileView && (
                            <div className="logo-hint">
                                <span className="hint-text">МЕНЮ</span>
                            </div>
                        )}
                    </NavLink>
                </div>

                {/* Список навигации для десктопа */}
                <ul className={`pill-list ${mobileMenuOpen ? 'mobile-visible' : ''} ${isClosing ? 'mobile-closing' : ''}`}>
                    {/* Затемняющий фон для мобильного меню */}
                    {isMobileView && mobileMenuOpen && (
                        <div className="mobile-menu-overlay"></div>
                    )}

                    {items.map((item) => (
                        <li key={item.href}>
                            <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                    `pill${isActive ? " is-active" : ""}`
                                }
                                onClick={handleCloseMenu}
                            >
                                <span className="pill-text">{item.label}</span>
                                <div className="pill-glass-effect">
                                    <div className="pill-background"></div>
                                </div>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default PillNav;