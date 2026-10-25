
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/resources.css";

type ResourceCard = {
    icon: string;
    title: string;
    description: string;
};

type ExternalResource = ResourceCard & {
    url: string;
    linkText: string;
};

const readingStrategies: ResourceCard[] = [
    {
        icon: "🎧",
        title: "Listen and Read Together",
        description:
            "Follow written text while listening to it being read aloud. " +
            "Combine listening with independent word-reading practice " +
            "to support both comprehension and decoding."
    },
    {
        icon: "🧩",
        title: "Break Reading Into Smaller Steps",
        description:
            "Divide longer passages into manageable sections. " +
            "Pause after each section to identify the main idea " +
            "and check understanding."
    },
    {
        icon: "🔤",
        title: "Build Word Recognition",
        description:
            "Practice letter-sound relationships, blending sounds, " +
            "and recognizing common spelling patterns. " +
            "Use explicit, systematic instruction when needed."
    },
    {
        icon: "💬",
        title: "Check for Understanding",
        description:
            "Ask questions such as: What happened? Why did it happen? " +
            "What might happen next? Encourage learners to explain " +
            "their answers in their own words."
    },
    {
        icon: "⏰",
        title: "Practice Consistently",
        description:
            "Use short, focused reading sessions with breaks " +
            "when needed. Adjust the duration to the learner's " +
            "attention, energy, and comfort."
    }
];

const learningDifferences: ResourceCard[] = [
    {
        icon: "📖",
        title: "Understanding Dyslexia",
        description:
            "Dyslexia commonly affects accurate or fluent word " +
            "reading and spelling. It is not a measure of intelligence. " +
            "Structured literacy instruction and appropriate " +
            "accommodations can help."
    },
    {
        icon: "🧠",
        title: "ADHD and Reading",
        description:
            "ADHD can affect attention, working memory, " +
            "organization, and task completion. Breaking tasks " +
            "into smaller steps, reducing distractions, and " +
            "allowing breaks may help."
    },
    {
        icon: "🌈",
        title: "Other Learning Differences",
        description:
            "Reading challenges may involve language comprehension, " +
            "processing speed, sensory preferences, or other needs. " +
            "Support should reflect each learner's individual " +
            "strengths and difficulties."
    }
];

const parentTips: ResourceCard[] = [
    {
        icon: "🌟",
        title: "Celebrate Progress",
        description:
            "Recognize effort and specific improvements. " +
            "Focus on individual growth rather than comparison."
    },
    {
        icon: "🎯",
        title: "Offer Meaningful Choices",
        description:
            "Allow learners to choose appropriate reading topics, " +
            "formats, and environments when possible."
    },
    {
        icon: "📚",
        title: "Provide Guided Practice",
        description:
            "Teach foundational reading skills explicitly, " +
            "model new strategies, and provide feedback."
    },
    {
        icon: "📅",
        title: "Create Predictable Routines",
        description:
            "Use clear instructions, manageable tasks, " +
            "and consistent reading routines."
    },
    {
        icon: "🤝",
        title: "Work Together",
        description:
            "Share observations between families, educators, " +
            "and reading specialists to identify effective support."
    }
];

const externalResources: ExternalResource[] = [
    {
        icon: "📘",
        title: "International Dyslexia Association",
        description:
            "Information about dyslexia, structured literacy, " +
            "reading instruction, and accommodations.",
        url: "https://dyslexiaida.org/",
        linkText: "Visit IDA"
    },
    {
        icon: "📚",
        title: "Reading Rockets",
        description:
            "Free literacy activities, reading research, " +
            "and practical resources for parents and educators.",
        url: "https://www.readingrockets.org/",
        linkText: "Visit Reading Rockets"
    },
    {
        icon: "🧠",
        title: "Understood.org",
        description:
            "Accessible explanations of ADHD, dyslexia, " +
            "learning differences, and school support strategies.",
        url: "https://www.understood.org/",
        linkText: "Visit Understood"
    },
    {
        icon: "🎓",
        title: "Stanford Reading & Dyslexia Research",
        description:
            "Research-informed information for families " +
            "about reading development and reading difficulties.",
        url: "https://edneuro.stanford.edu/parents",
        linkText: "Explore Stanford Resources"
    }
];

function ResourceCards({
                           items
                       }: {
    items: ResourceCard[];
}) {
    return (
        <div className="resources-grid">
            {items.map((item) => (
                <article
                    className="resource-card"
                    key={item.title}
                >
                    <div
                        className="resource-icon"
                        aria-hidden="true"
                    >
                        {item.icon}
                    </div>

                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                </article>
            ))}
        </div>
    );
}

function Resources() {
    return (
        <>
            <Navbar />

            <main className="resources-page">

                {/* Page introduction */}
                <section className="resources-hero">
                    <div className="resources-container">
                        <span className="resources-eyebrow">
                            NEUROPATHWAYS LEARNING HUB
                        </span>

                        <h1>
                            Resources for Every
                            Reading Journey
                        </h1>

                        <p>
                            Explore practical reading strategies,
                            understand different learning needs,
                            and discover ways to make reading
                            more accessible and enjoyable.
                        </p>

                        <strong>
                            Different learners. Different strategies.
                            Your way.
                        </strong>
                    </div>
                </section>

                {/* Quick navigation */}
                <nav
                    className="resources-quick-nav"
                    aria-label="Resource categories"
                >
                    <a href="#reading-strategies">
                        Reading Strategies
                    </a>

                    <a href="#learning-differences">
                        Learning Differences
                    </a>

                    <a href="#parent-educator-tips">
                        Parents & Educators
                    </a>

                    <a href="#learning-tools">
                        Learning Tools
                    </a>

                    <a href="#trusted-resources">
                        Trusted Resources
                    </a>
                </nav>

                {/* Reading strategies */}
                <section
                    id="reading-strategies"
                    className="resources-section"
                >
                    <div className="resources-container">
                        <div className="resources-heading">
                            <span>READING STRATEGIES</span>
                            <h2>
                                Small Steps, Stronger Readers
                            </h2>
                            <p>
                                Explore practical approaches that
                                can help learners build skills,
                                understanding, and confidence.
                            </p>
                        </div>

                        <ResourceCards items={readingStrategies} />
                    </div>
                </section>

                {/* Learning differences */}
                <section
                    id="learning-differences"
                    className="resources-section resources-tinted"
                >
                    <div className="resources-container">
                        <div className="resources-heading">
                            <span>UNDERSTANDING LEARNERS</span>
                            <h2>
                                Every Brain Learns Differently
                            </h2>
                            <p>
                                Understanding learning differences
                                helps us identify supports that
                                work for each individual.
                            </p>
                        </div>

                        <ResourceCards items={learningDifferences} />
                    </div>
                </section>

                {/* Parents and educators */}
                <section
                    id="parent-educator-tips"
                    className="resources-section"
                >
                    <div className="resources-container">
                        <div className="resources-heading">
                            <span>SUPPORTING LEARNERS</span>
                            <h2>
                                For Parents and Educators
                            </h2>
                            <p>
                                Simple ways to encourage reading
                                development at home and in
                                the classroom.
                            </p>
                        </div>

                        <ResourceCards items={parentTips} />
                    </div>
                </section>

                {/* Accessibility tools */}
                <section
                    id="learning-tools"
                    className="resources-section resources-tinted"
                >
                    <div className="resources-container">
                        <div className="resources-tool-panel">
                            <div>
                                <span className="resources-eyebrow">
                                    ACCESSIBLE READING
                                </span>

                                <h2>
                                    Make Reading Work for You
                                </h2>

                                <p>
                                    Explore text-to-speech,
                                    adjustable fonts, text spacing,
                                    focus mode, and other options
                                    that may make reading more
                                    comfortable.
                                </p>

                                <p>
                                    Different tools help different
                                    learners. Experiment to discover
                                    which settings work best.
                                </p>

                                <Link
                                    to="/accessibility"
                                    className="resources-primary-link"
                                >
                                    Explore Accessibility
                                    <span aria-hidden="true"> →</span>
                                </Link>
                            </div>

                            <div
                                className="resources-tool-visual"
                                aria-hidden="true"
                            >
                                <span>📖</span>
                                <strong>
                                    Read • Learn • Grow
                                </strong>
                                <p>Your Way</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* External resources */}
                <section
                    id="trusted-resources"
                    className="resources-section"
                >
                    <div className="resources-container">
                        <div className="resources-heading">
                            <span>CONTINUE EXPLORING</span>
                            <h2>
                                Trusted Learning Resources
                            </h2>
                            <p>
                                Explore information and guidance
                                from established organizations
                                supporting reading and learning.
                            </p>
                        </div>

                        <div className="resources-grid">
                            {externalResources.map((resource) => (
                                <article
                                    className="resource-card"
                                    key={resource.title}
                                >
                                    <div
                                        className="resource-icon"
                                        aria-hidden="true"
                                    >
                                        {resource.icon}
                                    </div>

                                    <h3>{resource.title}</h3>
                                    <p>{resource.description}</p>

                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="resource-external-link"
                                    >
                                        {resource.linkText}
                                        <span aria-hidden="true"> ↗</span>
                                    </a>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Closing message */}
                <section className="resources-closing">
                    <div className="resources-container">
                        <h2>Your Reading Journey Is Unique</h2>

                        <p>
                            There is no single strategy that works
                            for every learner. Explore different
                            approaches, discover what helps you,
                            and celebrate progress along the way.
                        </p>

                        <strong>
                            Read • Learn • Grow • Your Way
                        </strong>
                    </div>
                </section>

                <div className="resources-disclaimer">
                    <p>
                        NeuroPathways provides educational
                        resources and learning support. It does
                        not diagnose dyslexia, ADHD, or other
                        learning conditions and is not a
                        replacement for professional evaluation
                        or specialized reading instruction.
                    </p>
                </div>

            </main>

            <Footer />
        </>
    );
}

export default Resources;
