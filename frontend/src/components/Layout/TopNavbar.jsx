import React from "react";
import UserProfileMenu from "../UserProfileMenu";

import "./TopNavbar.css";

function TopNavbar() {

    return (
        <header className="top-navbar">

            {/* LEFT */}
            <div className="navbar-left">

                <button
                    className="menu-button"
                    type="button"
                >
                    ☰
                </button>

            </div>


            {/* NAVIGATION */}
            <div className="navbar-actions">

                <button className="navbar-item">
                    ♧
                    <span>Notices</span>
                </button>

                <button className="navbar-item">
                    ☑
                    <span>Compliance</span>
                </button>

                <button className="navbar-item">
                    ◯
                    <span>WhatsApp</span>
                </button>

                <button className="navbar-item">
                    ✉
                    <span>Email</span>
                </button>

                <button className="navbar-item">
                    ▣
                    <span>Calendar</span>
                </button>

                <button className="navbar-item">
                    ☑
                    <span>To-Do</span>
                </button>

            </div>


            {/* SEARCH */}
            <div className="navbar-search">

                <span>⌕</span>

                <input
                    type="text"
                    placeholder="Search..."
                />

                <span className="search-shortcut">
                    Ctrl + K
                </span>

            </div>


            {/* RIGHT */}
            <div className="navbar-right">

                {/* Theme button */}
                <button className="theme-button">
                    ◐
                </button>


                {/* Employee */}
                <UserProfileMenu />

            </div>

        </header>
)
}

export default TopNavbar;