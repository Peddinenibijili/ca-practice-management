import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    User,
    Settings,
    LogOut,
    ChevronDown
} from "lucide-react";

import "./UserProfileMenu.css";

export default function UserProfileMenu() {

    const [open, setOpen] = useState(false);

    const dropdownRef = useRef(null);

    const navigate = useNavigate();


    /* =========================================
       GET LOGGED-IN USER
    ========================================= */

    const getLoggedInUser = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (storedUser) {
                return JSON.parse(storedUser);
            }

            const token =
                localStorage.getItem("token");

            if (token) {

                const payload =
                    JSON.parse(
                        atob(
                            token.split(".")[1]
                        )
                    );

                return payload;
            }

        } catch (error) {

            console.error(
                "USER LOAD ERROR:",
                error
            );

        }

        return {
            name: "Employee",
            email: "employee@example.com",
            role: "Employee"
        };
    };


    const user = getLoggedInUser();


    /* =========================================
       USER INITIALS
    ========================================= */

    const getInitials = (name) => {

        if (!name) {
            return "U";
        }

        const parts =
            name.trim().split(" ");

        if (parts.length === 1) {
            return parts[0]
                .substring(0, 2)
                .toUpperCase();
        }

        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();
    };


    const initials =
        getInitials(user.name);


    /* =========================================
       CLOSE WHEN CLICKING OUTSIDE
    ========================================= */

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(
                    event.target
                )
            ) {
                setOpen(false);
            }
        };


        document.addEventListener(
            "mousedown",
            handleClickOutside
        );


        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);


    /* =========================================
       LOGOUT
    ========================================= */

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        localStorage.removeItem(
            "selectedOrganization"
        );

        setOpen(false);

        navigate("/login", {
            replace: true
        });
    };


    return (

        <div
            className="user-profile"
            ref={dropdownRef}
        >

            {/* =================================
                PROFILE BUTTON
            ================================= */}

            <button
                type="button"
                className="user-profile-trigger"
                onClick={() =>
                    setOpen(!open)
                }
                aria-expanded={open}
            >

                <div className="user-avatar">

                    {initials}

                </div>


                <div className="user-online-dot"></div>


                <ChevronDown
                    size={16}
                    className={`user-chevron ${
                        open ? "open" : ""
                    }`}
                />

            </button>


            {/* =================================
                DROPDOWN
            ================================= */}

            {open && (

                <div className="user-profile-dropdown">

                    {/* PROFILE HEADER */}

                    <div className="profile-card-header">

                        <div className="profile-avatar-large">

                            {initials}

                        </div>


                        <div className="profile-user-details">

                            <div className="profile-user-name">
                                {user.name || "Employee"}
                            </div>


                            <div className="profile-user-email">

                                {user.email ||
                                    "employee@example.com"}

                            </div>


                            <div className="profile-user-role">

                                <span className="profile-status-dot"></span>

                                {user.role ||
                                    "Employee"}

                            </div>

                        </div>

                    </div>


                    {/* DIVIDER */}

                    <div className="profile-divider"></div>


                    {/* PROFILE */}

                    <button
                        type="button"
                        className="profile-action"
                        onClick={() => {

                            setOpen(false);

                            navigate("/profile");

                        }}
                    >

                        <span className="profile-action-icon">

                            <User size={17} />

                        </span>

                        <span className="profile-action-text">

                            My Profile

                        </span>

                    </button>


                    {/* SETTINGS */}

                    <button
                        type="button"
                        className="profile-action"
                        onClick={() => {

                            setOpen(false);

                            navigate("/settings");

                        }}
                    >

                        <span className="profile-action-icon">

                            <Settings size={17} />

                        </span>

                        <span className="profile-action-text">

                            Settings

                        </span>

                    </button>


                    {/* DIVIDER */}

                    <div className="profile-divider"></div>


                    {/* LOGOUT */}

                    <button
                        type="button"
                        className="profile-action profile-logout"
                        onClick={handleLogout}
                    >

                        <span className="profile-action-icon">

                            <LogOut size={17} />

                        </span>

                        <span className="profile-action-text">

                            Logout

                        </span>

                    </button>

                </div>

            )}

        </div>

    );
}