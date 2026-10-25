import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";

function Navbar() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(
        () => !!localStorage.getItem("neuropathwaysToken")
    );

    const handleLogout = () => {
        localStorage.removeItem("neuropathwaysToken");
        localStorage.removeItem("neuropathwaysUser");

        setIsLoggedIn(false);
        window.dispatchEvent(new Event("neuropathways-auth-changed"));
        navigate("/");
    };

    useEffect(() => {
        const syncAuthState = () => {
            setIsLoggedIn(
                !!localStorage.getItem("neuropathwaysToken")
            );
        };

        window.addEventListener(
            "neuropathways-auth-changed",
            syncAuthState
        );

        window.addEventListener("storage", syncAuthState);

        return () => {
            window.removeEventListener(
                "neuropathways-auth-changed",
                syncAuthState
            );

            window.removeEventListener("storage", syncAuthState);
        };
    }, []);

    return (
        <header className="navbar">
            <div className="navbar-inner">

                <Link to="/" className="brand">
                    <div className="brand-icon">📖</div>

                    <div className="brand-text">
                        <div className="brand-name">
                            Neuro<span>Pathways</span>
                        </div>

                        <div className="brand-tagline">
                            Read • Learn • Grow • Your Way
                        </div>
                    </div>
                </Link>

                <nav className="nav-links">
                    <Link to="/#journey">
                        How It Works
                    </Link>

                    <Link to="/#tools">
                        Adaptive Tools
                    </Link>

                    <Link to="/about">About</Link>
                </nav>

                <div className="nav-actions">

                    {isLoggedIn ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="nav-dashboard-btn"
                            >
                                <LayoutDashboard size={16} aria-hidden="true" />
                                Dashboard
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="nav-logout-btn"
                            >
                                <LogOut size={16} aria-hidden="true" />
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="nav-login-btn"
                            >
                                Log In
                            </Link>

                            <Link
                                to="/signup"
                                className="nav-signup-btn"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </header>
    );
}

export default Navbar;
