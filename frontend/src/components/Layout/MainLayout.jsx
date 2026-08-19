import React from "react";
import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";

function MainLayout({ children }) {

    return (
        <div className="app-layout">

            <Sidebar />

            <div className="main-section">

                <TopNavbar />

                <main className="main-content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default MainLayout;