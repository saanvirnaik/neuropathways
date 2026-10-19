// src/components/Hero.jsx

import { Link } from "react-router-dom";

function Hero() {
    return (
        <section className="hero">
            <div className="hero-content">

                <div className="eyebrow">
                    DIFFERENT MINDS. DIFFERENT PATHWAYS.
                </div>

                <h1>
                    Build Your Reading Skills
                    <span> One Step at a Time.</span>
                </h1>

                <p className="hero-description">
                    NeuroPathways creates a personalized reading journey based on
                    your current skill level, learning preferences, and progress.
                </p>

                <p className="hero-subtext">
                    Designed to support learners with dyslexia, ADHD and other
                    reading differences.
                </p>

                <div className="hero-actions">
                    <Link to="/signup" className="btn btn-primary btn-large">
                        Start Your Journey →
                    </Link>

                    <a href="#journey" className="btn btn-outline btn-large">
                        See How It Works
                    </a>
                </div>

                <div className="hero-highlights">

                    <div>
                        <strong>Personalized</strong>
                        <span>Learning pathways</span>
                    </div>

                    <div>
                        <strong>Adaptive</strong>
                        <span>Reading environment</span>
                    </div>

                    <div>
                        <strong>Progressive</strong>
                        <span>Level-by-level growth</span>
                    </div>

                </div>
            </div>

            <div className="hero-demo">

                <div className="reading-preview">

                    <div className="preview-header">
                        Your Reading Space
                    </div>

                    <div className="preview-controls">
                        <span>🔠 Larger Text</span>
                        <span>🎨 Background</span>
                        <span>🔊 Listen</span>
                    </div>

                    <h3>The Curious Fox</h3>

                    <p>
                        The fox walked slowly through the quiet forest.
                    </p>

                    <p>
                        She stopped when she heard something moving behind the trees.
                    </p>

                    <button>Continue Reading →</button>

                </div>

            </div>
        </section>
    );
}

export default Hero;