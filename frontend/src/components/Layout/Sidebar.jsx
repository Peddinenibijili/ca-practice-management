import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
    {
        label: "Home",
        path: "/dashboard",
        icon: "⌂",
    },
    {
        label: "Leads",
        path: "/leads",
        icon: "♙",
    },
    {
        label: "Clients",
        path: "/clients",
        icon: "♧",
    },
    {
        label: "Services",
        path: "/services",
        icon: "▣",
    },
    {
        label: "Tasks",
        path: "/tasks",
        icon: "☑",
    },
    {
        label: "Invoices",
        path: "/invoices",
        icon: "▤",
    },
    {
        label: "Team",
        path: "/team",
        icon: "♙",
    },
    {
        label: "Reports",
        path: "/reports",
        icon: "▥",
    },
    {
        label: "Settings",
        path: "/settings",
        icon: "⚙",
    },
];

function Sidebar() {
    return (
        <aside className="sidebar">

            {/* BRAND */}
            <div className="sidebar-brand">

                <div className="brand-logo">
                    CA
                </div>

                <div className="brand-text">
                    <strong>CA Practice</strong>
                    <span>Management</span>
                </div>

            </div>


            {/* MENU */}
            <nav className="sidebar-menu">

                {menuItems.map((item) => (

                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >

                        <span className="sidebar-icon">
                            {item.icon}
                        </span>

                        <span>
                            {item.label}
                        </span>

                    </NavLink>

                ))}

            </nav>

        </aside>
    );
}

export default Sidebar;