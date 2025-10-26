import React, { useRef } from "react";
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

    const cssVars: React.CSSProperties = {
        "--base": baseColor,
        "--pill-bg": pillColor,
        "--hover-text": hoveredPillTextColor,
        "--pill-text": pillTextColor
    } as React.CSSProperties;

    return (
        <div className="pill-nav-container">
            <nav
                ref={navRef}
                className={`pill-nav ${className}`}
                aria-label="Primary navigation"
                style={cssVars}
            >
                <div className="pill-logo desktop-only">
                    <NavLink to="/">
                        <img src={logo} alt="Level" className="logo-img" />
                    </NavLink>
                </div>

                <ul className="pill-list">
                    {items.map((item) => (
                        <li key={item.href}>
                            <NavLink
                                to={item.href}
                                className={({ isActive }) =>
                                    `pill${isActive ? " is-active" : ""}`
                                }
                            >
                <span className="label-stack">
                  <span className="pill-label">{item.label}</span>
                  <span className="pill-label-hover">{item.label}</span>
                </span>
                                <span className="hover-circle" />
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {onMobileMenuClick && (
                    <button
                        className="mobile-menu-button mobile-only"
                        onClick={onMobileMenuClick}
                        aria-label="Toggle menu"
                    >
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                        <span className="hamburger-line" />
                    </button>
                )}
            </nav>
        </div>
    );
};

export default PillNav;
