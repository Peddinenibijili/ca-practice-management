import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    useEffect(() => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const loadProfile = async () => {

            try {

                const response =
                    await api.get(
                        "/profile",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );

                setUser(response.data.user);

            } catch (error) {

                console.error(error);

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/login");
            }
        };

        loadProfile();

    }, [navigate]);


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };


    if (!user) {

        return (
            <h2>Loading...</h2>
        );
    }


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
                <strong>Email:</strong>{" "}
                {user.email}
            </p>

            <p>
                <strong>Role:</strong>{" "}
                {user.role}
            </p>

            <p>
                <strong>Organization:</strong>{" "}
                {user.organization_id}
            </p>

            <button onClick={logout}>
                Logout
            </button>

        </div>
    );
}

export default Dashboard;