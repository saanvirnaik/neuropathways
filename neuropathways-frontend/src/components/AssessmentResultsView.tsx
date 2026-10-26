
import "../styles/assessmentresultsview.css";

export type SkillResult = {
    name: string;
    correct: number;
    total: number;
    percentage: number;
    status?: string;
};

type AssessmentResultsViewProps = {
    overallScore: number;
    readingLevel: number | string;
    skills: SkillResult[];
    onDashboard?: () => void;
    onPractice?: () => void;
};

function AssessmentResultsView({
                                   overallScore,
                                   readingLevel,
                                   skills,
                                   onDashboard,
                                   onPractice
                               }: AssessmentResultsViewProps) {

    const clampPercentage = (value: number) =>
        Math.max(0, Math.min(100, value));

    const score = clampPercentage(overallScore);


    const getSkillStatus = (status?: string) => {
        switch (status?.toUpperCase()) {
            case "STRONG":
                return {
                    label: "Doing Well",
                    type: "strong"
                };

            case "DEVELOPING":
                return {
                    label: "Keep Growing",
                    type: "growing"
                };

            case "NEEDS_PRACTICE":
                return {
                    label: "Let's Practice",
                    type: "practice"
                };

            default:
                return {
                    label: "Keep Practicing",
                    type: "growing"
                };
        }
    };

    const focusSkill =
        skills.length > 0
            ? [...skills].sort(
                (a, b) => a.percentage - b.percentage
            )[0]
            : null;

    return (
        <main className="assessment-results-page">
            <div className="assessment-results-container">

                {/* Header */}
                <header className="assessment-results-header">
                    <span className="assessment-results-eyebrow">
                        YOUR READING JOURNEY
                    </span>

                    <h1>Your Reading Assessment</h1>

                    <p>
                        Great work completing your assessment!
                        Here's what you've discovered about
                        your reading skills.
                    </p>
                </header>

                {/* Overall summary */}
                <section
                    className="assessment-summary-grid"
                    aria-label="Assessment summary"
                >
                    <article className="assessment-summary-card">
                        <h2>Overall Score</h2>

                        <div
                            className="assessment-score-ring"
                            style={{
                                background: `conic-gradient(
                                    #7057f5 ${score}%,
                                    #ede9ff ${score}%
                                )`
                            }}
                        >
                            <div className="assessment-score-inner">
                                <strong>{score}%</strong>
                            </div>
                        </div>

                        <p className="assessment-summary-caption">
                            Your assessment score
                        </p>
                    </article>

                    <article className="assessment-summary-card">
                        <h2>Reading Level</h2>

                        <div className="assessment-level-circle">
                            {readingLevel}
                        </div>

                        <p className="assessment-summary-caption">
                            Your current starting point
                        </p>
                    </article>
                </section>

                {/* Skill breakdown */}
                <section className="assessment-skills-section">
                    <div className="assessment-section-heading">
                        <h2>Your Skills at a Glance</h2>

                        <p>
                            Every skill is an opportunity
                            to learn and grow.
                        </p>
                    </div>

                    <div className="assessment-skills-grid">
                        {skills.map((skill) => {
                            const percentage =
                                clampPercentage(skill.percentage);

                            const status =
                                getSkillStatus(skill.status);

                            return (
                                <article
                                    className="assessment-skill-card"
                                    key={skill.name}
                                >
                                    <h3>{skill.name}</h3>

                                    <div className="assessment-skill-score">
                                        <strong>
                                            {Math.round(percentage)}%
                                        </strong>

                                        <span>
                                            {skill.correct} of{" "}
                                            {skill.total} correct
                                        </span>
                                    </div>

                                    <div
                                        className="assessment-progress-track"
                                        role="progressbar"
                                        aria-label={`${skill.name} score`}
                                        aria-valuenow={percentage}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    >
                                        <div
                                            className={
                                                "assessment-progress-fill " +
                                                status.type
                                            }
                                            style={{
                                                width: `${percentage}%`
                                            }}
                                        />
                                    </div>

                                    <span
                                        className={
                                            "assessment-status " +
                                            status.type
                                        }
                                    >
                                        {status.label}
                                    </span>
                                </article>
                            );
                        })}
                    </div>
                </section>

                {/* Recommended next step */}
                <section className="assessment-next-step">
                    <div
                        className="assessment-next-icon"
                        aria-hidden="true"
                    >
                        ✨
                    </div>

                    <div>
                        <h2>Your Next Step</h2>

                        {focusSkill &&
                        focusSkill.percentage < 70 ? (
                            <p>
                                You've made a great start!
                                Based on this assessment,{" "}
                                <strong>
                                    {focusSkill.name}
                                </strong>{" "}
                                could be a helpful skill
                                to practice next.
                            </p>
                        ) : (
                            <p>
                                Keep building your reading
                                confidence through regular,
                                comfortable practice.
                            </p>
                        )}

                        {onPractice && (
                            <button
                                type="button"
                                className="assessment-primary-btn"
                                onClick={onPractice}
                            >
                                Continue Practicing →
                            </button>
                        )}
                    </div>
                </section>

                {/* Navigation */}
                {onDashboard && (
                    <div className="assessment-results-actions">
                        <button
                            type="button"
                            className="assessment-secondary-btn"
                            onClick={onDashboard}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}

                {/* Disclaimer */}
                <div className="assessment-results-disclaimer">
                    <span aria-hidden="true">🛡️</span>

                    <p>
                        These results help guide reading
                        practice. They are not a medical
                        or clinical diagnosis.
                    </p>
                </div>

            </div>
        </main>
    );
}

export default AssessmentResultsView;
