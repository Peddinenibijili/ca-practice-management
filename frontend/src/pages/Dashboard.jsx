import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        inactive: 0
    });

    const [loadingStats, setLoadingStats] = useState(true);


    // ==========================================
    // LOAD PROFILE + DASHBOARD STATS
    // ==========================================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }


        const loadDashboard = async () => {

            try {

                // --------------------------------
                // LOAD USER PROFILE
                // --------------------------------

                const profileResponse =
                    await api.get("/profile");

                setUser(
                    profileResponse.data.user
                );


                // --------------------------------
                // LOAD DASHBOARD STATISTICS
                // --------------------------------

                const statsResponse =
                    await api.get("/dashboard/stats");


                console.log(
                    "DASHBOARD STATS:",
                    statsResponse.data
                );


                setStats(
                    statsResponse.data.clients
                );


            } catch (error) {

                console.error(
                    "DASHBOARD ERROR:",
                    error
                );


                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    navigate("/login");

                }

            } finally {

                setLoadingStats(false);

            }

        };


        loadDashboard();

    }, [navigate]);


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/login");

    };


    // ==========================================
    // LOADING
    // ==========================================

    if (!user) {

        return (
            <h2>
                Loading...
            </h2>
        );

    }


    // ==========================================
    // DASHBOARD UI
    // ==========================================

    return (

        <div className="dashboard">

            <h1>
                Welcome, {user.full_name}
            </h1>


            <hr />


            <h2>
                Practice Dashboard
            </h2>


            <p>
                <strong>
                    Email:
                </strong>{" "}

                {user.email}
            </p>


            <p>
                <strong>
                    Role:
                </strong>{" "}

                {user.role}
            </p>


            <p>
                <strong>
                    Organization:
                </strong>{" "}

                {user.organization_id}
            </p>


            <button onClick={logout}>
                Logout
            </button>


            <br />
            <br />


            {/* ================================= */}
            {/* CLIENT STATISTICS */}
            {/* ================================= */}

            <div className="dashboard-card">

                <h3>
                    Total Clients
                </h3>


                <div className="dashboard-number">

                    {loadingStats
                        ? "..."
                        : stats.total
                    }

                </div>


                <p>
                    Active:{" "}

                    {loadingStats
                        ? "..."
                        : stats.active
                    }

                </p>


                <p>
                    Inactive:{" "}

                    {loadingStats
                        ? "..."
                        : stats.inactive
                    }

                </p>


                <button
                    onClick={() =>
                        navigate("/clients")
                    }
                >
                    Manage Clients
                </button>

            </div>

        </div>

    );

}

export default Dashboard;