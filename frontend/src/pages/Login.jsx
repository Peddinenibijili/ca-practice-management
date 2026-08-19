import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/auth/login",
                {
                    email,
                    password
                }
            );

            console.log(
                "LOGIN RESPONSE:",
                response.data
            );


            // Save JWT
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Save user
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="login-container">

            <div className="login-card">

                <h1>CA Practice Management</h1>

                <p>
                    Sign in to your account
                </p>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>

                    <label>Email</label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        placeholder="Enter email"
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter password"
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Login"
                        }
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;