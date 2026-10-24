import type {FormEvent} from "react";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import Navbar from "../components/Navbar";
import {registerUser, loginUser, saveLoginSession} from "../services/authService";

function Signup() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
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
            await registerUser({
                firstName,
                lastName,
                email,
                password,
            });

            try {
                saveLoginSession(await loginUser({email, password}));
            } catch {
                throw new Error("Your account was created. Please use the Log in link below to sign in.");
            }

            navigate("/assessment");
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
                        <span>LET'S GET YOU STARTED</span>

                        <h1>Create Your Profile</h1>

                        <p>
                            Create your NeuroPathways account and
                            begin your personalized reading journey.
                        </p>
                    </div>

                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >
                        <label>
                            First Name

                            <input
                                type="text"
                                value={firstName}
                                onChange={(event) =>
                                    setFirstName(event.target.value)
                                }
                                placeholder="Enter first name"
                                required
                            />
                        </label>

                        <label>
                            Last Name

                            <input
                                type="text"
                                value={lastName}
                                onChange={(event) =>
                                    setLastName(event.target.value)
                                }
                                placeholder="Enter last name"
                                required
                            />
                        </label>

                        <label>
                            Email

                            <input
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                placeholder="Enter email"
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
                                placeholder="Create password"
                                minLength={8}
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
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login">
                            Log in
                        </Link>
                    </p>
                </div>
            </main>
        </>
    );
}

export default Signup;
