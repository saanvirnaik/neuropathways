import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const pathway = [
    {
        status: "complete",
        level: "Level 1",
        title: "Sound & Letter Patterns",
        description:
            "Recognize common sounds, letters, and basic word patterns.",
    },
    {
        status: "complete",
        level: "Level 2",
        title: "Word Decoding",
        description:
            "Break unfamiliar words into smaller parts and sound them out.",
    },
    {
        status: "current",
        level: "Level 3",
        title: "Vocabulary in Context",
        description:
            "Use clues in a sentence to understand unfamiliar words.",
    },
    {
        status: "locked",
        level: "Level 4",
        title: "Reading Fluency",
        description:
            "Build smoother reading with improved pacing and accuracy.",
    },
    {
        status: "locked",
        level: "Level 5",
        title: "Reading Comprehension",
        description:
            "Understand main ideas, details, sequence, and meaning.",
    },
    {
        status: "locked",
        level: "Level 6",
        title: "Inference & Deeper Meaning",
        description:
            "Use evidence and clues to understand ideas not directly stated.",
    },
];

function LearningPath() {
    return (
        <>
            <Navbar />

            <main className="learning-path-page">
                <section className="learning-path-header">
          <span className="eyebrow">
            YOUR PERSONALIZED PATHWAY
          </span>

                    <h1>Your Reading Journey Starts Here</h1>

                    <p>
                        Based on your assessment, NeuroPathways has identified the skills
                        you already know and the best next step for you.
                    </p>

                    <div className="current-level-card">
                        <div>
                            <span>Your Starting Level</span>
                            <h2>Level 3 — Developing Reader</h2>
                        </div>

                        <div className="score-circle">
                            62%
                        </div>
                    </div>
                </section>

                <section className="pathway-container">
                    {pathway.map((item, index) => (
                        <article
                            className={`pathway-card ${item.status}`}
                            key={item.title}
                        >
                            <div className="pathway-number">
                                {item.status === "complete"
                                    ? "✓"
                                    : index + 1}
                            </div>

                            <div className="pathway-content">
                                <span>{item.level}</span>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </div>

                            <div className="pathway-status">
                                {item.status === "complete" && "Mastered"}
                                {item.status === "current" && "Start Here"}
                                {item.status === "locked" && "🔒 Locked"}
                            </div>
                        </article>
                    ))}
                </section>

                <div className="pathway-actions">
                    <Link
                        to="/dashboard"
                        className="primary-form-button"
                    >
                        Go to My Dashboard →
                    </Link>
                </div>
            </main>
        </>
    );
}

export default LearningPath;