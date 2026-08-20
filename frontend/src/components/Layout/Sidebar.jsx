import React from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    FileText,
    ShieldCheck,
    CalendarDays,
    CheckSquare,
    Bell,
    Settings
} from "lucide-react";

import OrganizationSelector from "../OrganizationSelector";

import "../Sidebar.css";

const mainMenu = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard
    },
    {
        name: "Clients",
        path: "/clients",
        icon: Users
    },
    {
        name: "Documents",
        path: "/documents",
        icon: FileText
    },
    {
        name: "Compliance",
        path: "/compliance",
        icon: ShieldCheck
    },
    {
        name: "Calendar",
        path: "/calendar",
        icon: CalendarDays
    }
];

const workspaceMenu = [
    {
        name: "To-Do",
        path: "/todo",
        icon: CheckSquare
    },
    {
        name: "Notices",
        path: "/notices",
        icon: Bell
    }
];

function SidebarMenuItem({ item }) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                `sidebar-menu-item ${
                    isActive ? "active" : ""
                }`
            }
        >
            <Icon
                size={19}
                strokeWidth={1.8}
            />

            <span>{item.name}</span>
        </NavLink>
    );
}

export default function Sidebar() {
    return (
        <aside className="sidebar">

            {/* =========================
                ORGANIZATION
            ========================== */}

            <div className="sidebar-top">

                <OrganizationSelector />

            </div>


            {/* =========================
                NAVIGATION
            ========================== */}

            <div className="sidebar-navigation">

                {/* MAIN */}

                <div className="sidebar-section">

                    <div className="sidebar-section-title">
                        MAIN
                    </div>

                    <nav className="sidebar-menu">

                        {mainMenu.map((item) => (
                            <SidebarMenuItem
                                key={item.name}
                                item={item}
                            />
                        ))}

                    </nav>

                </div>


                {/* WORKSPACE */}

                <div className="sidebar-section">

                    <div className="sidebar-section-title">
                        WORKSPACE
                    </div>

                    <nav className="sidebar-menu">

                        {workspaceMenu.map((item) => (
                            <SidebarMenuItem
                                key={item.name}
                                item={item}
                            />
                        ))}

                    </nav>

                </div>

            </div>

        </aside>
    );
}