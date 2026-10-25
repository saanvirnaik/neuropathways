import "../styles/about.css";

type Value = {
    icon: string;
    title: string;
    description: string;
};

const values: Value[] = [
    {
        icon: "💜",
        title: "Strengths First",
        description:
            "Every learner brings unique abilities. We focus on building confidence while developing reading skills."
    },
    {
        icon: "🌈",
        title: "Accessible by Design",
        description:
            "Reading should be comfortable and approachable, with choices that support different learning preferences."
    },
    {
        icon: "🛤️",
        title: "Individual Pathways",
        description:
            "Learning is not one-size-fits-all. Each learner deserves opportunities to progress in their own way."
    },
    {
        icon: "🌱",
        title: "Progress, Not Pressure",
        description:
            "We encourage steady improvement, meaningful milestones, and learning at a comfortable pace."
    }
];

function About() {
    return (
        <section id="about" className="about-section">
            <div className="about-container">

                <div className="section-heading">
                    <span>ABOUT NEUROPATHWAYS</span>

                    <h2>
                        Every Reader Deserves Their Own Path
                    </h2>

                    <p>
                        Different minds. Different strengths.
                        Endless possibilities.
                    </p>
                </div>

                <div className="about-mission">
                    <div className="about-mission-content">
                        <span className="about-eyebrow">
                            OUR MISSION
                        </span>

                        <h3>
                            Reading Support Built Around
                            the Learner
                        </h3>

                        <p>
                            NeuroPathways is designed to make
                            reading more accessible, personalized,
                            and encouraging for learners with
                            dyslexia, ADHD, and other reading
                            differences.
                        </p>

                        <p>
                            We believe learners should have the
                            freedom to discover what works for
                            them, practice at a comfortable pace,
                            and recognize their progress along
                            the way.
                        </p>
                    </div>

                    <div className="about-mission-visual">
                        <div className="about-visual-icon">
                            📖
                        </div>

                        <p>
                            Read • Learn • Grow
                        </p>

                        <strong>Your Way</strong>
                    </div>
                </div>

                <div className="about-values-heading">
                    <h3>What Guides NeuroPathways</h3>
                    <p>
                        Four principles behind our approach
                        to supportive reading experiences.
                    </p>
                </div>

                <div className="about-values-grid">
                    {values.map((value) => (
                        <article
                            className="about-value-card"
                            key={value.title}
                        >
                            <div className="about-value-icon">
                                {value.icon}
                            </div>

                            <h4>{value.title}</h4>

                            <p>{value.description}</p>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default About;
