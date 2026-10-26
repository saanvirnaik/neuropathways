
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/accessibility.css";

type AccessibilityTool = {
    icon: string;
    title: string;
    description: string;
    tip: string;
};

type AccessibilityPrinciple = {
    icon: string;
    title: string;
    description: string;
};

const accessibilityTools: AccessibilityTool[] = [
    {
        icon: "🔠",
        title: "Adjustable Text Size",
        description:
            "Larger text can make reading more comfortable " +
            "for learners who find small print difficult.",
        tip: "Try increasing text size until words are easy to follow."
    },
    {
        icon: "🔤",
        title: "Readable Fonts",
        description:
            "Different fonts and letter shapes may feel " +
            "more comfortable to different readers.",
        tip: "Choose a clear font that feels natural to you."
    },
    {
        icon: "🎨",
        title: "Background Colors",
        description:
            "Alternative background and text color combinations " +
            "may help reduce visual discomfort for some learners.",
        tip: "Experiment with contrast and colors to find a comfortable setting."
    },
    {
        icon: "🔊",
        title: "Text to Speech",
        description:
            "Listening to written content can support access " +
            "to information and help learners follow longer passages.",
        tip: "Try listening while following the text on screen."
    },
    {
        icon: "🎯",
        title: "Focus Mode",
        description:
            "Reducing visual distractions may help learners " +
            "concentrate on the current reading activity.",
        tip: "Use focus mode when the page feels visually busy."
    },
    {
        icon: "📏",
        title: "Reading Guide",
        description:
            "A reading guide can help some learners track " +
            "their position while moving through a passage.",
        tip: "Use the guide if you frequently lose your place."
    },
    {
        icon: "↔️",
        title: "Word Spacing",
        description:
            "Adjustable spacing can make text feel less crowded " +
            "and may improve comfort for some readers.",
        tip: "Increase spacing gradually and choose what feels easiest."
    },
    {
        icon: "⏱️",
        title: "Flexible Reading Pace",
        description:
            "Learners may need different amounts of time " +
            "to read, understand, and complete activities.",
        tip: "Take breaks when needed and focus on understanding."
    }
];

const accessibilityPrinciples: AccessibilityPrinciple[] = [
    {
        icon: "⌨️",
        title: "Keyboard Accessibility",
        description:
            "Our goal is to support navigation and interaction " +
            "without requiring a mouse."
    },
    {
        icon: "👁️",
        title: "Clear Visual Design",
        description:
            "Readable typography, sufficient contrast, " +
            "and predictable layouts can reduce unnecessary barriers."
    },
    {
        icon: "🧭",
        title: "Simple Navigation",
        description:
            "Consistent page structure and descriptive links " +
            "help learners find information more easily."
    },
    {
        icon: "🧩",
        title: "Flexible Learning",
        description:
            "We aim to support different learning preferences " +
            "without assuming one approach works for everyone."
    }
];

function Accessibility() {
    return (
        <>
            <Navbar />

            <main className="accessibility-page">

                {/* Hero */}
                <section className="accessibility-hero">
                    <div className="accessibility-container">
                        <span className="accessibility-eyebrow">
                            ACCESSIBILITY AT NEUROPATHWAYS
                        </span>

                        <h1>
                            Reading Should Work for Everyone
                        </h1>

                        <p>
                            Personalize your reading experience,
                            discover supportive tools, and explore
                            strategies that help you learn
                            in your own way.
                        </p>

                        <strong>
                            Different needs. Different preferences.
                            Your way.
                        </strong>
                    </div>
                </section>

                {/* Commitment */}
                <section className="accessibility-section">
                    <div className="accessibility-container">
                        <div className="accessibility-commitment">
                            <div
                                className="accessibility-commitment-icon"
                                aria-hidden="true"
                            >
                                💜
                            </div>

                            <div>
                                <span className="accessibility-eyebrow">
                                    OUR COMMITMENT
                                </span>

                                <h2>
                                    Accessibility Is Part of
                                    How We Design
                                </h2>

                                <p>
                                    NeuroPathways aims to make reading
                                    more accessible, personalized,
                                    and encouraging for learners with
                                    dyslexia, ADHD, and other
                                    reading differences.
                                </p>

                                <p>
                                    We believe accessibility means
                                    giving learners meaningful choices,
                                    reducing unnecessary barriers,
                                    and making it easier to engage
                                    with learning materials.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reading tools */}
                <section
                    className="accessibility-section accessibility-tinted"
                    id="reading-tools"
                >
                    <div className="accessibility-container">
                        <div className="accessibility-heading">
                            <span>PERSONALIZE YOUR EXPERIENCE</span>

                            <h2>
                                Reading Accessibility Tools
                            </h2>

                            <p>
                                Explore options that can make
                                reading more comfortable.
                                Different tools work for
                                different learners.
                            </p>
                        </div>

                        <div className="accessibility-tools-grid">
                            {accessibilityTools.map((tool) => (
                                <article
                                    className="accessibility-tool-card"
                                    key={tool.title}
                                >
                                    <div
                                        className="accessibility-tool-icon"
                                        aria-hidden="true"
                                    >
                                        {tool.icon}
                                    </div>

                                    <h3>{tool.title}</h3>

                                    <p>{tool.description}</p>

                                    <div className="accessibility-tool-tip">
                                        <strong>Try this:</strong>
                                        <span>{tool.tip}</span>
                                    </div>
                                </article>
                            ))}
                        </div>

                        <p className="accessibility-tools-note">
                            These descriptions explain the
                            reading-support options NeuroPathways
                            is designed around. Availability
                            may vary as features are developed.
                        </p>
                    </div>
                </section>

                {/* Broader accessibility */}
                <section className="accessibility-section">
                    <div className="accessibility-container">
                        <div className="accessibility-heading">
                            <span>BEYOND READING SETTINGS</span>

                            <h2>
                                An Inclusive Learning Experience
                            </h2>

                            <p>
                                Accessibility involves more than
                                changing the appearance of text.
                                It also includes how learners
                                navigate and interact with
                                the platform.
                            </p>
                        </div>

                        <div className="accessibility-principles-grid">
                            {accessibilityPrinciples.map((item) => (
                                <article
                                    className="accessibility-principle-card"
                                    key={item.title}
                                >
                                    <div
                                        className="accessibility-tool-icon"
                                        aria-hidden="true"
                                    >
                                        {item.icon}
                                    </div>

                                    <h3>{item.title}</h3>
                                    <p>{item.description}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tips */}
                <section className="accessibility-section accessibility-tinted">
                    <div className="accessibility-container">
                        <div className="accessibility-tips-panel">
                            <span className="accessibility-eyebrow">
                                FIND WHAT WORKS
                            </span>

                            <h2>
                                Your Best Reading Settings
                                Are Personal
                            </h2>

                            <p>
                                No single font, color, or reading
                                tool works best for everyone.
                                What matters is finding an
                                experience that feels comfortable
                                and supports your learning.
                            </p>

                            <ul>
                                <li>
                                    Start with one adjustment at a time.
                                </li>
                                <li>
                                    Choose settings based on comfort,
                                    readability, and understanding.
                                </li>
                                <li>
                                    Take breaks when reading
                                    becomes tiring.
                                </li>
                                <li>
                                    Ask a parent, teacher, or
                                    specialist for additional
                                    support when needed.
                                </li>
                            </ul>

                            <Link
                                to="/resources"
                                className="accessibility-primary-link"
                            >
                                Explore Learning Resources
                                <span aria-hidden="true"> →</span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Feedback */}
                <section className="accessibility-feedback">
                    <div className="accessibility-container">
                        <span className="accessibility-eyebrow">
                            ACCESSIBILITY SUPPORT
                        </span>

                        <h2>
                            Help Us Make NeuroPathways Better
                        </h2>

                        <p>
                            Accessibility is an ongoing process.
                            If you experience difficulty accessing
                            information, navigating the website,
                            or using a learning feature, we
                            welcome your feedback.
                        </p>

                        <Link
                            to="/contact"
                            className="accessibility-primary-link"
                        >
                            Contact Us
                            <span aria-hidden="true"> →</span>
                        </Link>
                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}

export default Accessibility;
