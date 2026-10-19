// src/components/JourneySteps.jsx

const steps = [
    {
        number: "01",
        icon: "👤",
        title: "Create Your Profile",
        description:
            "Tell NeuroPathways about your reading goals and learning preferences."
    },

    {
        number: "02",
        icon: "📋",
        title: "Take an Assessment",
        description:
            "Complete short reading activities so we can understand your current level."
    },

    {
        number: "03",
        icon: "🛤️",
        title: "Get Your Pathway",
        description:
            "Receive a personalized sequence of reading skills and activities."
    },

    {
        number: "04",
        icon: "📚",
        title: "Practice & Improve",
        description:
            "Complete activities designed for your current learning level."
    },

    {
        number: "05",
        icon: "📈",
        title: "Unlock the Next Level",
        description:
            "Track your growth and advance as your reading skills improve."
    }
];

function JourneySteps() {
    return (
        <section id="journey" className="journey-section">

            <div className="section-heading">
                <span>YOUR JOURNEY</span>

                <h2>
                    From Assessment to Progress
                </h2>

                <p>
                    NeuroPathways helps you understand where you are,
                    what to work on next, and how you're improving.
                </p>
            </div>

            <div className="journey-grid">

                {steps.map((step) => (
                    <article className="journey-card" key={step.number}>

                        <div className="step-number">
                            {step.number}
                        </div>

                        <div className="step-icon">
                            {step.icon}
                        </div>

                        <h3>{step.title}</h3>

                        <p>{step.description}</p>

                    </article>
                ))}

            </div>

        </section>
    );
}

export default JourneySteps;