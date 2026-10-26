import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
    getLearningPath,
    type LearningPathResponse
} from "../services/learningPathApi";
import "../styles/learningpath.css";

const STATUS_LABELS = {
    STRONG: "Doing Well",
    FOCUS: "Recommended Focus",
    AVAILABLE: "Available",
    UPCOMING: "Coming Next"
};

function LearningPath() {
    const navigate = useNavigate();

    const [pathway, setPathway] =
        useState<LearningPathResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;

        async function loadPathway() {
            try {
                const data = await getLearningPath();

                if (active) {
                    setPathway(data);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load your learning pathway."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        void loadPathway();

        return () => {
            active = false;
        };
    }, []);

    return (
        <>
            <Navbar />

            <main className="learning-path-page">
                <div className="learning-path-container">

                    {loading && (
                        <p role="status">
                            Preparing your personalized pathway...
                        </p>
                    )}

                    {!loading && error && (
                        <div className="learning-path-empty">
                            <h1>Your Pathway Is Waiting</h1>
                            <p>{error}</p>

                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    )}

                    {!loading && pathway && (
                        <>
                            <header className="learning-path-header">
                                <span className="learning-path-eyebrow">
                                    YOUR PERSONALIZED PATHWAY
                                </span>

                                <h1>
                                    Your Reading Journey Starts Here
                                </h1>

                                <p>
                                    Based on your assessment,
                                    here are your reading strengths
                                    and opportunities to grow.
                                </p>
                            </header>

                            <section className="learning-path-summary">
                                <div>
                                    <p>Your Starting Level</p>

                                    <h2>
                                        Level {pathway.startingLevel}
                                    </h2>

                                    <span>
                                        Your assessment-based
                                        starting point
                                    </span>
                                </div>

                                <div className="learning-path-score">
                                    {pathway.overallScore}%
                                </div>
                            </section>

                            <section
                                className="learning-path-levels"
                                aria-label="Your learning pathway"
                            >
                                {pathway.levels.map((level) => (
                                    <article
                                        key={level.level}
                                        className={
                                            `learning-path-card ${level.pathwayStatus.toLowerCase()}`
                                        }
                                    >
                                        <div className="learning-path-number">
                                            {level.level}
                                        </div>

                                        <div className="learning-path-details">
                                            <span>Level {level.level}</span>

                                            <h3>{level.title}</h3>

                                            <p>{level.description}</p>

                                            {level.assessmentScore !== null && (
                                                <small>
                                                    Assessment skill score:{" "}
                                                    {level.assessmentScore}%
                                                </small>
                                            )}
                                        </div>

                                        <span
                                            className={
                                                `learning-path-status ${level.pathwayStatus.toLowerCase()}`
                                            }
                                        >
                                            {STATUS_LABELS[level.pathwayStatus]}
                                        </span>
                                    </article>
                                ))}
                            </section>

                            <button
                                type="button"
                                className="learning-path-dashboard"
                                onClick={() => navigate("/dashboard")}
                            >
                                Go to My Dashboard →
                            </button>

                            <p className="learning-path-note">
                                Your pathway is a starting guide
                                based on your assessment, not
                                a diagnosis or a fixed measure
                                of your abilities.
                            </p>
                        </>
                    )}

                </div>
            </main>

            <Footer />
        </>
    );
}

export default LearningPath;
