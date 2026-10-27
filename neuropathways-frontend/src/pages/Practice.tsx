
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AccessibleReading from "../components/AccessibleReading";

import { getLearningPath } from "../services/learningPathApi";

import {
    PRACTICE_SKILLS,
    startPracticeSession,
    getCurrentPracticeQuestion,
    submitPracticeAnswer,
    getPracticeResults,
    type PracticeSkill,
    type PracticeSessionResponse,
    type PracticeQuestionResponse,
    type PracticeAnswerFeedback,
    type PracticeResultsResponse
} from "../services/practiceService";

import "../styles/practice.css";
import GuidedPassage from "../components/GuidedPassage.tsx";

type PracticeStage =
    | "choose"
    | "questions"
    | "complete";

function getCurrentTime(): number {
    return performance.now();
}

function calculateResponseTime(startedAt: number): number {
    return Math.max(
        0,
        Math.round(getCurrentTime() - startedAt)
    );
}

function Practice() {
    const navigate = useNavigate();

    const [recommendedSkill, setRecommendedSkill] =
        useState<PracticeSkill | null>(null);

    const [selectedSkill, setSelectedSkill] =
        useState<PracticeSkill | null>(null);

    const [stage, setStage] =
        useState<PracticeStage>("choose");

    const [session, setSession] =
        useState<PracticeSessionResponse | null>(null);

    const [currentQuestion, setCurrentQuestion] =
        useState<PracticeQuestionResponse | null>(null);

    const [selectedAnswer, setSelectedAnswer] =
        useState<string | null>(null);

    const [feedback, setFeedback] =
        useState<PracticeAnswerFeedback | null>(null);

    const [results, setResults] =
        useState<PracticeResultsResponse | null>(null);

    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Tracks time spent on the current question.
    const questionStartedAt = useRef<number>(0);

    // Prevents duplicate backend requests.
    const requestInProgress = useRef(false);

    // Records whether Read Aloud was used for this question.
    const usedReadAloud = useRef(false);

    useEffect(() => {
        let active = true;

        async function loadRecommendation() {
            try {
                const pathway = await getLearningPath();

                const matchingSkill = PRACTICE_SKILLS.find(
                    skill =>
                        skill.id === pathway.recommendedFocus
                );

                if (active) {
                    setRecommendedSkill(
                        matchingSkill?.id ?? null
                    );
                }
            } catch {
                // Manual practice remains available.
            }
        }

        void loadRecommendation();

        return () => {
            active = false;
        };
    }, []);

    const recommendedSkillInfo = PRACTICE_SKILLS.find(
        skill => skill.id === recommendedSkill
    );

    const selectedSkillInfo = PRACTICE_SKILLS.find(
        skill => skill.id === selectedSkill
    );

    async function startPractice(skill: PracticeSkill) {
        if (requestInProgress.current) return;

        requestInProgress.current = true;
        setLoading(true);
        setError(null);

        try {
            const newSession =
                await startPracticeSession(skill);

            const question =
                await getCurrentPracticeQuestion(
                    newSession.sessionId
                );

            setSelectedSkill(skill);
            setSession(newSession);
            setCurrentQuestion(question);
            setSelectedAnswer(null);
            setFeedback(null);
            setResults(null);
            setStage("questions");

            usedReadAloud.current = false;
            questionStartedAt.current = getCurrentTime();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to start practice."
            );
        } finally {
            setLoading(false);
            requestInProgress.current = false;
        }
    }

    async function selectAnswer(option: string) {
        if (
            !session ||
            !currentQuestion ||
            feedback ||
            submitting ||
            requestInProgress.current
        ) {
            return;
        }

        requestInProgress.current = true;
        setSubmitting(true);
        setError(null);

        const responseTimeMs = calculateResponseTime(
            questionStartedAt.current
        );

        try {
            const answerFeedback =
                await submitPracticeAnswer(
                    session.sessionId,
                    {
                        questionId:
                        currentQuestion.questionId,
                        selectedOption: option,
                        responseTimeMs,
                        usedReadAloud:
                        usedReadAloud.current
                    }
                );

            setSelectedAnswer(option);
            setFeedback(answerFeedback);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to save your answer."
            );
        } finally {
            setSubmitting(false);
            requestInProgress.current = false;
        }
    }

    async function nextQuestion() {
        if (
            !session ||
            !feedback ||
            requestInProgress.current
        ) {
            return;
        }

        requestInProgress.current = true;
        setLoading(true);
        setError(null);

        try {
            if (feedback.completed) {
                const sessionResults =
                    await getPracticeResults(
                        session.sessionId
                    );

                setResults(sessionResults);
                setStage("complete");
            } else {
                const question =
                    await getCurrentPracticeQuestion(
                        session.sessionId
                    );

                setCurrentQuestion(question);
                setSelectedAnswer(null);
                setFeedback(null);

                usedReadAloud.current = false;
                questionStartedAt.current = getCurrentTime();
            }
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load the next step."
            );
        } finally {
            setLoading(false);
            requestInProgress.current = false;
        }
    }

    function backToSkills() {
        setStage("choose");
        setSelectedSkill(null);
        setSession(null);
        setCurrentQuestion(null);
        setSelectedAnswer(null);
        setFeedback(null);
        setResults(null);
        setError(null);

        usedReadAloud.current = false;
    }

    // Prepare speech text from the backend question.
    // The options object contains keys such as A, B, C, D.
    const questionSpeechText = currentQuestion
        ? [
            currentQuestion.passage,
            currentQuestion.question,
            ...Object.entries(
                currentQuestion.options
            ).map(
                ([key, option]) =>
                    `Option ${key}: ${option}`
            )
        ]
            .filter(Boolean)
            .join(". ")
        : "";

    return (
        <>
            <Navbar />

            <main className="practice-page">
                <div className="practice-container">

                    <header className="practice-header">
                        <span className="practice-eyebrow">
                            YOUR PERSONALIZED PRACTICE
                        </span>

                        <h1>
                            Build Your Reading Skills
                        </h1>

                        <p>
                            Choose a skill, practice at
                            your own pace, and celebrate
                            every step forward.
                        </p>
                    </header>

                    {error && (
                        <div
                            className="practice-error"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    {/* SKILL SELECTION */}

                    {stage === "choose" && (
                        <>
                            {recommendedSkillInfo && (
                                <section
                                    className="practice-recommendation"
                                >
                                    <span
                                        className="practice-eyebrow"
                                    >
                                        RECOMMENDED FOR YOU
                                    </span>

                                    <h2>
                                        {
                                            recommendedSkillInfo.title
                                        }
                                    </h2>

                                    <p>
                                        {
                                            recommendedSkillInfo.description
                                        }
                                        {" "}
                                        This recommendation is
                                        based on your latest
                                        completed assessment.
                                    </p>

                                    <button
                                        type="button"
                                        className="practice-primary-button"
                                        disabled={loading}
                                        onClick={() =>
                                            startPractice(
                                                recommendedSkillInfo.id
                                            )
                                        }
                                    >
                                        Start Recommended
                                        Practice →
                                    </button>
                                </section>
                            )}

                            <section
                                className="practice-skill-section"
                            >
                                <h2>
                                    Choose a Skill to Practice
                                </h2>

                                <div
                                    className="practice-skill-grid"
                                >
                                    {PRACTICE_SKILLS.map(
                                        skill => (
                                            <button
                                                type="button"
                                                key={skill.id}
                                                className="practice-skill-card"
                                                disabled={loading}
                                                onClick={() =>
                                                    startPractice(
                                                        skill.id
                                                    )
                                                }
                                            >
                                                <h3>
                                                    {skill.title}
                                                </h3>

                                                <p>
                                                    {
                                                        skill.description
                                                    }
                                                </p>

                                                <span>
                                                    Start Practice →
                                                </span>
                                            </button>
                                        )
                                    )}
                                </div>
                            </section>
                        </>
                    )}

                    {/* PRACTICE QUESTIONS */}

                    {stage === "questions" &&
                        currentQuestion && (
                            <section
                                className="practice-question-card"
                            >
                                <div
                                    className="practice-question-top"
                                >
                                    <span
                                        className="practice-eyebrow"
                                    >
                                        QUESTION{" "}
                                        {
                                            currentQuestion.questionNumber
                                        }
                                        {" "}OF{" "}
                                        {
                                            currentQuestion.totalQuestions
                                        }
                                    </span>

                                    <span>
                                        {
                                            selectedSkillInfo?.title
                                        }
                                        {" · "}
                                        Difficulty{" "}
                                        {
                                            currentQuestion.difficulty
                                        }
                                    </span>
                                </div>

                                <div
                                    className="practice-progress-track"
                                >
                                    <div
                                        className="practice-progress-fill"
                                        style={{
                                            width: `${
                                                (
                                                    currentQuestion.questionNumber /
                                                    currentQuestion.totalQuestions
                                                ) * 100
                                            }%`
                                        }}
                                    />
                                </div>

                                {/*
                                  AccessibleReading applies:
                                  - Text Size
                                  - Readable Font
                                  - Soft Background
                                  - More Spacing
                                  - Focus Mode
                                  - Reading Guide
                                  - Text to Speech
                                */}

                                <AccessibleReading
                                    key={
                                        currentQuestion.questionId
                                    }
                                    speechText={
                                        questionSpeechText
                                    }
                                    onReadAloud={() => {
                                        usedReadAloud.current =
                                            true;
                                    }}
                                >
                                    {currentQuestion.passage && (
                                        <GuidedPassage
                                            key={currentQuestion.questionId}
                                            text={currentQuestion.passage}
                                            className="practice-passage"
                                        />
                                    )}

                                    <h2>
                                        {
                                            currentQuestion.question
                                        }
                                    </h2>

                                    <div
                                        className="practice-options"
                                    >
                                        {Object.entries(
                                            currentQuestion.options
                                        ).map(
                                            ([key, option]) => {
                                                let optionClass =
                                                    "practice-option";

                                                if (feedback) {
                                                    if (
                                                        key ===
                                                        feedback.correctOption
                                                    ) {
                                                        optionClass +=
                                                            " correct";
                                                    } else if (
                                                        key ===
                                                        selectedAnswer
                                                    ) {
                                                        optionClass +=
                                                            " incorrect";
                                                    }
                                                }

                                                return (
                                                    <button
                                                        type="button"
                                                        key={key}
                                                        className={
                                                            optionClass
                                                        }
                                                        disabled={
                                                            submitting ||
                                                            loading ||
                                                            feedback !==
                                                            null
                                                        }
                                                        onClick={() =>
                                                            selectAnswer(
                                                                key
                                                            )
                                                        }
                                                    >
                                                        {option}
                                                    </button>
                                                );
                                            }
                                        )}
                                    </div>
                                </AccessibleReading>

                                {/* ANSWER FEEDBACK */}

                                {feedback && (
                                    <div
                                        className="practice-feedback"
                                        role="status"
                                    >
                                        <h3>
                                            {feedback.correct
                                                ? "Great work!"
                                                : "Good effort! Let's learn together."}
                                        </h3>

                                        <p>
                                            {
                                                feedback.explanation
                                            }
                                        </p>

                                        <button
                                            type="button"
                                            className="practice-primary-button"
                                            disabled={loading}
                                            onClick={
                                                nextQuestion
                                            }
                                        >
                                            {feedback.completed
                                                ? "See My Results →"
                                                : "Next Question →"}
                                        </button>
                                    </div>
                                )}

                                {submitting && (
                                    <p role="status">
                                        Saving your answer...
                                    </p>
                                )}
                            </section>
                        )}

                    {/* PRACTICE RESULTS */}

                    {stage === "complete" && results && (
                        <section
                            className="practice-complete-card"
                        >
                            <span
                                className="practice-eyebrow"
                            >
                                PRACTICE COMPLETE
                            </span>

                            <h2>
                                Great Job Practicing!
                            </h2>

                            <div
                                className="practice-result-circle"
                            >
                                {results.scorePercent}%
                            </div>

                            <p>
                                You answered{" "}
                                {results.correctAnswers}
                                {" "}out of{" "}
                                {results.totalQuestions}
                                {" "}questions correctly.
                            </p>

                            <p>
                                Every practice session
                                is a chance to learn
                                and grow.
                            </p>

                            <div
                                className="practice-complete-actions"
                            >
                                {selectedSkill && (
                                    <button
                                        type="button"
                                        className="practice-primary-button"
                                        disabled={loading}
                                        onClick={() =>
                                            startPractice(
                                                selectedSkill
                                            )
                                        }
                                    >
                                        Practice Again
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className="practice-secondary-button"
                                    onClick={
                                        backToSkills
                                    }
                                >
                                    Choose Another Skill
                                </button>

                                <button
                                    type="button"
                                    className="practice-secondary-button"
                                    onClick={() =>
                                        navigate(
                                            "/dashboard"
                                        )
                                    }
                                >
                                    Back to Dashboard
                                </button>
                            </div>

                            <p
                                className="practice-disclaimer"
                            >
                                Practice scores support
                                learning feedback.
                                They do not provide
                                a diagnosis or establish
                                reading mastery.
                            </p>
                        </section>
                    )}

                    {loading && (
                        <p
                            className="practice-loading"
                            role="status"
                        >
                            Preparing your practice...
                        </p>
                    )}

                </div>
            </main>

            <Footer />
        </>
    );
}

export default Practice;
