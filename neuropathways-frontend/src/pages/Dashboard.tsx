import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import ReadingPreferences from "../components/ReadingPreferences";
import { useReadingPreferences } from "../context/useReadingPreferences";
import { mapLearnerPreferences } from "../context/readingPreferencesMapper";

import {
    getDashboard,
} from "../services/dashboardService";

import type {
    DashboardData,
} from "../services/dashboardService";

import {
    getPreferences,
    savePreferences,
} from "../services/preferenceService";

import type {
    LearnerPreferences,
} from "../services/preferenceService";


function Dashboard() {
    const [dashboard, setDashboard] =
        useState<DashboardData | null>(null);

    const [preferences, setPreferences] =
        useState<LearnerPreferences | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [savingPreferences, setSavingPreferences] = useState(false);
    const [preferenceSaveError, setPreferenceSaveError] = useState("");
    const saveQueue = useRef<Promise<void>>(Promise.resolve());
    const pendingSaves = useRef(0);
    const navigate = useNavigate();
    const { updatePreferences } = useReadingPreferences();

    useEffect(() => {
        let active = true;

        async function loadDashboard() {
            try {
                setLoading(true);
                setError("");

                const [dashboardData, preferencesData] = await Promise.all([
                    getDashboard(),
                    getPreferences(),
                ]);

                if (!active) return;

                setDashboard(dashboardData);
                setPreferences(preferencesData);
                updatePreferences(mapLearnerPreferences(preferencesData));
            } catch (err) {
                if (!active) return;
                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load dashboard."
                );
            } finally {
                if (active) setLoading(false);
            }
        }

        void loadDashboard();
        return () => {
            active = false;
        };
    }, [updatePreferences]);

    const handlePreferenceChange = (updatedPreferences: LearnerPreferences) => {
        // Apply changes immediately in Dashboard, Practice, and Assessment.
        setPreferences(updatedPreferences);
        updatePreferences(mapLearnerPreferences(updatedPreferences));
        setPreferenceSaveError("");
        setSavingPreferences(true);
        pendingSaves.current += 1;

        // Serialize writes so rapid clicks cannot persist an older selection last.
        saveQueue.current = saveQueue.current
            .catch(() => undefined)
            .then(async () => {
                try {
                    await savePreferences(updatedPreferences);
                } catch (err) {
                    console.error("Unable to save reading preferences:", err);
                    setPreferenceSaveError(
                        "Your reading settings could not be saved. Please try changing a setting again."
                    );
                } finally {
                    pendingSaves.current -= 1;
                    if (pendingSaves.current === 0) {
                        setSavingPreferences(false);
                    }
                }
            });
    };


    if (loading) {
        return (
            <>
                <Navbar />

                <main className="dashboard-page">
                    <div className="dashboard-loading">
                        Loading your reading journey...
                    </div>
                </main>
            </>
        );
    }


    if (error || !dashboard) {
        return (
            <>
                <Navbar />

                <main className="dashboard-page">
                    <div className="dashboard-error">
                        <h2>
                            We couldn't load your dashboard.
                        </h2>

                        <p>
                            {error || "Please try again."}
                        </p>
                    </div>
                </main>
            </>
        );
    }


    const pageClasses = [
        "dashboard-page",

        preferences?.fontFamily === "READABLE"
            ? "reader-readable-font"
            : "",

        preferences?.backgroundTheme === "SOFT"
            ? "reader-soft-background"
            : "",

        preferences?.increasedSpacing
            ? "reader-increased-spacing"
            : "",
    ]
        .filter(Boolean)
        .join(" ");


    const assessmentScore =
        dashboard.progressPercent ?? 0;

    const practiceMastery =
        dashboard.currentMastery ?? 0;

    const levelCheckThreshold =
        dashboard.levelCheckThreshold ?? 80;


    return (
        <>
            <Navbar />

            <main
                className={pageClasses}
                style={{
                    fontSize: preferences
                        ? `${preferences.fontSize}px`
                        : undefined,
                }}
            >

                <div className="dashboard-shell">

                    {/* ==================================================
              HEADER
          ================================================== */}

                    <section className="dashboard-hero">

                        <div>
              <span className="eyebrow">
                MY READING JOURNEY
              </span>

                            <h1>
                                Hi, {dashboard.firstName} 👋
                            </h1>

                            <p>
                                See where you are,
                                what to work on next,
                                and how you're progressing.
                            </p>
                        </div>


                        {dashboard.assessmentStatus ===
                            "COMPLETED" && (

                                <div className="streak-card">
                <span className="streak-icon">
                  🔥
                </span>

                                    <div>
                                        <strong>
                                            {dashboard.streakDays ?? 0}
                                            {" "}Day Streak
                                        </strong>

                                        <span>
                    Keep it going!
                  </span>
                                    </div>
                                </div>

                            )}

                    </section>


                    {/* ==================================================
              NOT STARTED
          ================================================== */}

                    {dashboard.assessmentStatus ===
                        "NOT_STARTED" && (

                            <section className="assessment-state-card">

                                <div className="assessment-state-icon">
                                    📋
                                </div>

                                <div className="assessment-state-content">

                <span className="eyebrow">
                  YOUR FIRST STEP
                </span>

                                    <h2>
                                        Let's Find Your Starting Point
                                    </h2>

                                    <p>
                                        Complete a short reading assessment
                                        so NeuroPathways can understand
                                        your strengths and build a
                                        personalized learning path.
                                    </p>

                                    <div className="assessment-benefits">

                                        <div>
                                            <span>⏱</span>

                                            <div>
                                                <strong>
                                                    10–15 minutes
                                                </strong>

                                                <small>
                                                    Work at your own pace
                                                </small>
                                            </div>
                                        </div>


                                        <div>
                                            <span>📖</span>

                                            <div>
                                                <strong>
                                                    Multiple skills
                                                </strong>

                                                <small>
                                                    Vocabulary, decoding,
                                                    comprehension and more
                                                </small>
                                            </div>
                                        </div>


                                        <div>
                                            <span>🛤️</span>

                                            <div>
                                                <strong>
                                                    Your pathway
                                                </strong>

                                                <small>
                                                    Built from your results
                                                </small>
                                            </div>
                                        </div>

                                    </div>

                                    <Link
                                        to="/assessment"
                                        className="primary-form-button"
                                    >
                                        Start My Assessment →
                                    </Link>

                                </div>

                            </section>

                        )}


                    {/* ==================================================
              ASSESSMENT IN PROGRESS
          ================================================== */}

                    {dashboard.assessmentStatus ===
                        "IN_PROGRESS" && (

                            <section className="assessment-state-card">

                                <div className="assessment-state-icon">
                                    📖
                                </div>

                                <div className="assessment-state-content">

                <span className="eyebrow">
                  ASSESSMENT IN PROGRESS
                </span>

                                    <h2>
                                        Continue Where You Left Off
                                    </h2>

                                    <p>
                                        Your answers have been saved.
                                        Continue your assessment without
                                        starting over.
                                    </p>


                                    <div className="assessment-progress-summary">

                                        <div className="assessment-progress-text">

                    <span>
                      Question{" "}
                        {dashboard.assessmentCurrentQuestion ?? 1}
                        {" "}of{" "}
                        {dashboard.assessmentTotalQuestions ?? 0}
                    </span>

                                            <strong>
                                                {calculateAssessmentProgress(
                                                    dashboard.assessmentCurrentQuestion,
                                                    dashboard.assessmentTotalQuestions
                                                )}
                                                %
                                            </strong>

                                        </div>


                                        <div className="progress-bar">

                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width:
                                                        `${calculateAssessmentProgress(
                                                            dashboard.assessmentCurrentQuestion,
                                                            dashboard.assessmentTotalQuestions
                                                        )}%`
                                                }}
                                            />

                                        </div>

                                    </div>


                                    {dashboard.assessmentSessionId && (

                                        <Link
                                            to={
                                                `/assessment/session/${
                                                    dashboard.assessmentSessionId
                                                }`
                                            }
                                            className="primary-form-button"
                                        >
                                            Continue Assessment →
                                        </Link>

                                    )}

                                </div>

                            </section>

                        )}


                    {/* ==================================================
              COMPLETED
          ================================================== */}

                    {dashboard.assessmentStatus ===
                        "COMPLETED" && (

                            <>

                                {/* CURRENT JOURNEY */}

                                <div className="dashboard-section-heading">
                                    <div>
                  <span className="eyebrow">
                    CURRENT JOURNEY
                  </span>

                                        <h2>
                                            Your Reading Progress
                                        </h2>
                                    </div>
                                </div>


                                <section className="dashboard-overview-grid">

                                    <article className="dashboard-level-card">

                  <span className="card-label">
                    CURRENT LEVEL
                  </span>

                                        <div className="level-heading-row">

                                            <div>
                                                <h2>
                                                    Level{" "}
                                                    {dashboard.currentLevel ?? "-"}
                                                </h2>

                                                {dashboard.currentSkill && (
                                                    <p className="current-skill">
                                                        {formatSkillName(
                                                            dashboard.currentSkill
                                                        )}
                                                    </p>
                                                )}
                                            </div>


                                            <div className="assessment-score-pill">

                                                <strong>
                                                    {assessmentScore}%
                                                </strong>

                                                <span>
                        assessment
                      </span>

                                            </div>

                                        </div>


                                        <p className="level-description">
                                            Your pathway is based on
                                            your assessment results.
                                            Practice and level checks
                                            will adapt it as you improve.
                                        </p>


                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{
                                                    width:
                                                        `${assessmentScore}%`
                                                }}
                                            />
                                        </div>


                                        <div className="progress-label">

                    <span>
                      Starting assessment:
                        {" "}
                        {assessmentScore}%
                    </span>

                                            <span>
                      Level {dashboard.currentLevel}
                    </span>

                                        </div>


                                        <Link
                                            to="/learning-path"
                                            className="primary-form-button"
                                        >
                                            View My Learning Path →
                                        </Link>

                                    </article>


                                    <article className="weekly-card">

                  <span className="card-label">
                    THIS WEEK
                  </span>

                                        <div className="weekly-stat">

                                            <strong>
                                                {dashboard.activitiesThisWeek ?? 0}
                                            </strong>

                                            <span>
                      Activities
                    </span>

                                        </div>


                                        <div className="weekly-stat">

                                            <strong>
                                                {dashboard.minutesThisWeek ?? 0}
                                            </strong>

                                            <span>
                      Minutes practiced
                    </span>

                                        </div>


                                        <div className="weekly-stat">

                                            <strong>
                                                {dashboard.skillsImproved ?? 0}
                                            </strong>

                                            <span>
                      Skills improved
                    </span>

                                        </div>

                                    </article>

                                </section>


                                {/* NEXT STEP */}

                                <div className="dashboard-section-heading">

                                    <div>
                  <span className="eyebrow">
                    YOUR NEXT STEP
                  </span>

                                        <h2>
                                            Practice. Check. Progress.
                                        </h2>
                                    </div>

                                </div>


                                <section className="learning-actions-card">

                                    <article className="practice-card">

                                        <div className="action-icon">
                                            📚
                                        </div>

                                        <span className="card-label">
                    PRACTICE
                  </span>

                                        <h2>
                                            Practice at Level{" "}
                                            {dashboard.currentLevel}
                                        </h2>

                                        <p>
                                            Work on the skills that need
                                            the most attention based on
                                            your assessment and recent
                                            activity.
                                        </p>

                                        <button
                                            type="button"
                                            className="dashboard-practice-btn"
                                            onClick={() => navigate("/practice")}
                                        >
                                            Start Practice <span aria-hidden="true">→</span>
                                        </button>

                                    </article>


                                    <article className="level-check-panel">

                                        <div className="action-icon">
                                            🎯
                                        </div>

                                        <span className="card-label">
                    NEXT LEVEL
                  </span>

                                        <h2>
                                            Level Check
                                        </h2>

                                        <p>
                                            Once your practice mastery
                                            reaches the target, take a
                                            short check to see if you're
                                            ready to move forward.
                                        </p>


                                        <div className="mastery-comparison">

                                            <div>

                                                <strong>
                                                    {practiceMastery}%
                                                </strong>

                                                <span>
                        Practice mastery
                      </span>

                                            </div>


                                            <div>

                                                <strong>
                                                    {levelCheckThreshold}%
                                                </strong>

                                                <span>
                        Unlock target
                      </span>

                                            </div>

                                        </div>


                                        <div className="mini-progress-bar">

                                            <div
                                                className="mini-progress-fill"
                                                style={{
                                                    width:
                                                        `${Math.min(
                                                            100,
                                                            practiceMastery
                                                        )}%`
                                                }}
                                            />

                                        </div>


                                        {dashboard.levelCheckEligible ? (

                                            <Link
                                                to="/level-check"
                                                className="primary-form-button"
                                            >
                                                Take Level Check →
                                            </Link>

                                        ) : (

                                            <div className="level-check-message">
                                                🔒 Reach{" "}
                                                {levelCheckThreshold}%
                                                {" "}practice mastery
                                                to unlock the Level Check.
                                            </div>

                                        )}

                                    </article>

                                </section>


                                {/* SKILLS */}

                                <div className="dashboard-section-heading">

                                    <div>
                  <span className="eyebrow">
                    YOUR SKILLS
                  </span>

                                        <h2>
                                            What You're Working On
                                        </h2>
                                    </div>

                                </div>


                                <section className="skills-overview-grid">

                                    <article className="skills-card">

                                        {dashboard.skills &&
                                        dashboard.skills.length > 0 ? (

                                            dashboard.skills.map(
                                                (skill) => (

                                                    <div
                                                        className="skill-row"
                                                        key={skill.skill}
                                                    >

                                                        <div>

                                                            <strong>
                                                                {formatSkillName(
                                                                    skill.skill
                                                                )}
                                                            </strong>

                                                            <span>
                              {formatSkillLabel(
                                  skill.status
                              )}
                            </span>

                                                        </div>


                                                        <div className="skill-score">

                                                            {
                                                                skill.mastery
                                                            }
                                                            %

                                                        </div>

                                                    </div>

                                                )
                                            )

                                        ) : (

                                            <div className="empty-skills-state">

                                                <div>
                                                    📊
                                                </div>

                                                <h3>
                                                    Skill results are coming next
                                                </h3>

                                                <p>
                                                    Your detailed skill scores
                                                    will appear here once they
                                                    are connected to the
                                                    dashboard service.
                                                </p>

                                            </div>

                                        )}

                                    </article>


                                    <article className="next-activity-card">

                  <span className="card-label">
                    NEXT ACTIVITY
                  </span>


                                        {dashboard.nextActivity ? (

                                            <>

                                                <h2>
                                                    {dashboard.nextActivity.title}
                                                </h2>

                                                <p>
                                                    Practice{" "}
                                                    {formatSkillName(
                                                        dashboard.nextActivity.skill
                                                    )}
                                                    {" "}with a targeted activity.
                                                </p>

                                                <div className="activity-meta">

                        <span>
                          ⏱{" "}
                            {
                                dashboard
                                    .nextActivity
                                    .estimatedMinutes
                            }
                            {" "}minutes
                        </span>

                                                    <span>
                          📖{" "}
                                                        {formatSkillName(
                                                            dashboard
                                                                .nextActivity
                                                                .skill
                                                        )}
                        </span>

                                                </div>


                                                <Link
                                                    to={
                                                        `/practice/${
                                                            dashboard.nextActivity.id
                                                        }`
                                                    }
                                                    className="primary-form-button"
                                                >
                                                    Start Activity →
                                                </Link>

                                            </>

                                        ) : (

                                            <>

                                                <h2>
                                                    Practice Your Current Skills
                                                </h2>

                                                <p>
                                                    Start targeted practice
                                                    to build your mastery and
                                                    prepare for the next
                                                    level check.
                                                </p>

                                                <button
                                                    type="button"
                                                    className="dashboard-practice-btn"
                                                    onClick={() => navigate("/practice")}
                                                >
                                                    Find Practice <span aria-hidden="true">→</span>
                                                </button>

                                            </>

                                        )}

                                    </article>

                                </section>


                                {/* READING SETTINGS */}

                                <div className="dashboard-section-heading settings-heading">

                                    <div>
                  <span className="eyebrow">
                    PERSONALIZE YOUR EXPERIENCE
                  </span>

                                        <h2>
                                            My Reading Settings
                                        </h2>

                                        <p>
                                            Adjust NeuroPathways to match
                                            what helps you read comfortably.
                                        </p>
                                    </div>

                                </div>


                                {preferences && (

                                    <ReadingPreferences
                                        preferences={preferences}
                                        saving={savingPreferences}
                                        onChange={
                                            handlePreferenceChange
                                        }
                                    />

                                )}
                                {preferenceSaveError && (
                                    <p role="alert" className="preference-save-error">
                                        {preferenceSaveError}
                                    </p>
                                )}


                                {/* REASSESS */}

                                <section className="reassess-card">

                                    <div>

                  <span className="card-label">
                    REASSESS WHEN YOU'RE READY
                  </span>

                                        <h3>
                                            Measure your progress again
                                        </h3>

                                        <p>
                                            A new assessment is saved
                                            separately, so previous
                                            results remain available
                                            for comparison.
                                        </p>

                                    </div>


                                    <Link
                                        to="/assessment"
                                        className="btn btn-outline"
                                    >
                                        Retake Assessment
                                    </Link>

                                </section>

                            </>

                        )}

                </div>

            </main>
        </>
    );
}


function calculateAssessmentProgress(
    currentQuestion: number | null,
    totalQuestions: number | null
) {

    if (
        !currentQuestion ||
        !totalQuestions ||
        totalQuestions <= 0
    ) {
        return 0;
    }

    return Math.min(
        100,
        Math.round(
            (
                (currentQuestion - 1) /
                totalQuestions
            ) * 100
        )
    );
}


function formatSkillName(
    skill: string
) {

    return skill
        .toLowerCase()
        .split("_")
        .map(
            word =>
                word.charAt(0).toUpperCase()
                + word.slice(1)
        )
        .join(" ");
}


function formatSkillLabel(
    status: string
) {

    switch (status) {

        case "STRONG":
            return "Strong";

        case "PROFICIENT":
            return "Proficient";

        case "DEVELOPING":
            return "Developing";

        case "NEEDS_PRACTICE":
            return "Needs practice";

        default:
            return "";
    }
}

export default Dashboard;
