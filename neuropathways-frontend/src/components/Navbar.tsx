import { Link } from "react-router-dom";

function Navbar() {
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
                    <a href="#how-it-works">How It Works</a>
                    <a href="#features">Features</a>
                    <a href="#adaptive-tools">Adaptive Tools</a>
                    <a href="#about">About</a>
                </nav>

                <div className="nav-actions">
                    <Link to="/login" className="login-button">
                        Log In
                    </Link>

                    <Link to="/signup" className="start-button">
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Navbar;