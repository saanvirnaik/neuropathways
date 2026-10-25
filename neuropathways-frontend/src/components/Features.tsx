import "../styles/features.css";

type Feature = {
    icon: string;
    title: string;
    description: string;
};

const features: Feature[] = [
    {
        icon: "📋",
        title: "Reading Assessment",
        description:
            "Discover reading strengths and identify skills to develop through short, engaging assessments."
    },
    {
        icon: "🛤️",
        title: "Personalized Learning Pathways",
        description:
            "Follow a structured reading journey based on your current skill level and learning goals."
    },
    {
        icon: "📚",
        title: "Skill-Based Practice",
        description:
            "Build reading confidence through targeted activities designed to strengthen individual skills."
    },
    {
        icon: "📈",
        title: "Progress Tracking",
        description:
            "Monitor achievements, recognize improvements, and track reading development over time."
    },
    {
        icon: "⚙️",
        title: "Flexible Reading Experience",
        description:
            "Customize text size, fonts, spacing, and other settings for comfortable reading."
    },
    {
        icon: "🌟",
        title: "Supportive Learning",
        description:
            "Practice at your own pace in an environment that encourages confidence and independence."
    }
];

function Features() {
    return (
        <section id="features" className="features-section">
            <div className="section-heading">
                <span>BUILT AROUND EVERY LEARNER</span>

                <h2>A Reading Journey Designed for You</h2>

                <p>
                    NeuroPathways combines personalized learning,
                    accessible reading tools, and meaningful progress
                    tracking to help every learner grow.
                </p>
            </div>

            <div className="features-grid">
                {features.map((feature) => (
                    <article
                        className="feature-card"
                        key={feature.title}
                    >
                        <div className="feature-icon">
                            {feature.icon}
                        </div>

                        <h3>{feature.title}</h3>

                        <p>{feature.description}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default Features;
