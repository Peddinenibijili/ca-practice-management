import React from "react";

import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

import "./MainLayout.css";

export default function MainLayout({ children }) {

    return (

        <div className="main-layout">

            <Sidebar />

            <div className="main-area">

                <TopNavbar />

                <main className="page-content">
                    {children}
                </main>

            </div>

        </div>

    );
}