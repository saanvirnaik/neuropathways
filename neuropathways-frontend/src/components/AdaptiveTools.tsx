// src/components/AdaptiveTools.jsx

const tools = [
    {
        icon: "Aa",
        title: "Text Size",
        description: "Increase or reduce text size for comfortable reading."
    },

    {
        icon: "A",
        title: "Readable Fonts",
        description: "Choose from several easy-to-read font styles."
    },

    {
        icon: "◐",
        title: "Background Colors",
        description: "Try softer background colors that reduce visual strain."
    },

    {
        icon: "🔊",
        title: "Text to Speech",
        description: "Listen to passages while following the words."
    },

    {
        icon: "👁",
        title: "Focus Mode",
        description: "Show smaller sections of text to reduce distractions."
    },

    {
        icon: "📏",
        title: "Reading Guide",
        description: "Highlight the current line while reading."
    },

    {
        icon: "↔",
        title: "Word Spacing",
        description: "Increase spacing between letters, words and lines."
    },

    {
        icon: "⏸",
        title: "Flexible Pace",
        description: "Take breaks and complete activities without time pressure."
    }
];

function AdaptiveTools() {
    return (
        <section id="tools" className="adaptive-section">

            <div className="section-heading">

                <span>LEARNING THAT ADAPTS TO YOU</span>

                <h2>
                    Make Reading More Comfortable
                </h2>

                <p>
                    Every learner processes information differently.
                    NeuroPathways lets students adjust the reading environment
                    to match what works best for them.
                </p>

            </div>

            <div className="adaptive-grid">

                {tools.map((tool) => (
                    <article className="tool-card" key={tool.title}>

                        <div className="tool-icon">
                            {tool.icon}
                        </div>

                        <h3>{tool.title}</h3>

                        <p>{tool.description}</p>

                    </article>
                ))}

            </div>

        </section>
    );
}

export default AdaptiveTools;