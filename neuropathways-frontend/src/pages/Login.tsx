import type {FormEvent} from "react";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import Navbar from "../components/Navbar";
import {loginUser, saveLoginSession} from "../services/authService";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setLoading(true);
        setError("");

        try {
            const loginResponse = await loginUser({
                email,
                password,
            });


            saveLoginSession(loginResponse);

            navigate("/dashboard");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(
                    "Something went wrong. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar/>

            <main className="auth-page">
                <div className="auth-card">
                    <div className="auth-heading">
                        <span>WELCOME BACK</span>

                        <h1>
                            Continue Your Reading Journey
                        </h1>

                        <p>
                            Log in to access your personalized
                            learning path and progress.
                        </p>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >
                        <label>
                            Email

                            <input
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="Enter your email"
                                required
                            />
                        </label>

                        <label>
                            Password

                            <input
                                type="password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                placeholder="Enter your password"
                                required
                            />
                        </label>

                        {error && (
                            <div className="form-error">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="primary-form-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Logging In..."
                                : "Log In"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        New to NeuroPathways?{" "}
                        <Link to="/signup">
                            Create an account
                        </Link>
                    </p>
                </div>
            </main>
        </>
    );
}

export default Login;
