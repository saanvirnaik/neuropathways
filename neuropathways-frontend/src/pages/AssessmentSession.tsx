
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import AccessibleReading from "../components/AccessibleReading";

import {
    getCurrentQuestion,
    submitAssessmentAnswer,
    type AssessmentQuestion
} from "../services/assessmentService";
import GuidedPassage from "../components/GuidedPassage.tsx";

type AssessmentLoadState = "loading" | "ready" | "error";

function getCurrentTime(): number {
    return performance.now();
}

function calculateResponseTime(startedAt: number): number {
    return Math.max(
        0,
        Math.round(getCurrentTime() - startedAt)
    );
}

function AssessmentSession() {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [question, setQuestion] =
        useState<AssessmentQuestion | null>(null);

    const [selectedOption, setSelectedOption] =
        useState("");

    const [loadState, setLoadState] =
        useState<AssessmentLoadState>("loading");

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    // Track time spent answering the current question.
    const questionStartedAt = useRef<number>(0);

    // Track whether Read Aloud was actually used.
    const usedReadAloud = useRef(false);

    // Prevent duplicate answer submissions.
    const requestInProgress = useRef(false);

    useEffect(() => {
        let active = true;

        async function loadQuestion() {
            if (!sessionId) {
                if (active) {
                    setError("Assessment session not found.");
                    setLoadState("error");
                }
                return;
            }

            try {
                const data = await getCurrentQuestion(
                    Number(sessionId)
                );

                if (!active) return;

                setQuestion(data);
                setSelectedOption("");
                setError("");
                setLoadState("ready");

                usedReadAloud.current = false;
                questionStartedAt.current = getCurrentTime();

            } catch (err) {
                if (!active) return;

                setError(
                    err instanceof Error
                        ? err.message
                        : "Unable to load assessment question."
                );

                setLoadState("error");
            }
        }

        void loadQuestion();

        return () => {
            active = false;
        };
    }, [sessionId]);

    async function handleSubmit() {
        if (
            !question ||
            !sessionId ||
            !selectedOption ||
            submitting ||
            requestInProgress.current
        ) {
            return;
        }

        requestInProgress.current = true;
        setSubmitting(true);
        setError("");

        const responseTimeMs = calculateResponseTime(
            questionStartedAt.current
        );

        try {
            const status = await submitAssessmentAnswer(
                Number(sessionId),
                {
                    questionId: question.questionId,
                    selectedOption,
                    responseTimeMs,
                    usedReadAloud: usedReadAloud.current
                }
            );

            if (status.status === "COMPLETED") {
                navigate(
                    `/assessment/session/${sessionId}/results`
                );
                return;
            }

            const nextQuestion = await getCurrentQuestion(
                Number(sessionId)
            );

            setQuestion(nextQuestion);
            setSelectedOption("");
            setError("");

            usedReadAloud.current = false;
            questionStartedAt.current = getCurrentTime();

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to submit your answer."
            );
        } finally {
            setSubmitting(false);
            requestInProgress.current = false;
        }
    }

    if (loadState === "loading") {
        return (
            <>
                <Navbar />

                <main className="assessment-page">
                    <div
                        className="dashboard-loading"
                        role="status"
                    >
                        Loading assessment...
                    </div>
                </main>
            </>
        );
    }

    if (loadState === "error" || !question) {
        return (
            <>
                <Navbar />

                <main className="assessment-page">
                    <div className="dashboard-error">
                        <h2>
                            We couldn't load this question.
                        </h2>

                        <p>
                            {error || "Please try again."}
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </main>
            </>
        );
    }

    const progress = Math.round(
        (
            (question.questionNumber - 1) /
            question.totalQuestions
        ) * 100
    );

    // Prepare the passage, question, and answer choices
    // for the AccessibleReading text-to-speech feature.
    const questionSpeechText = [
        question.passage,
        question.question,
        ...Object.entries(question.options).map(
            ([key, value]) => `Option ${key}: ${value}`
        )
    ]
        .filter(Boolean)
        .join(". ");

    return (
        <>
            <Navbar />

            <main className="assessment-page">
                <section className="assessment-session-container">

                    {/* ASSESSMENT HEADER */}

                    <div className="assessment-session-topbar">
                        <div className="assessment-title-block">

                            <div className="assessment-title-icon">
                                📖
                            </div>

                            <div>
                                <span className="eyebrow">
                                    {formatSkillName(question.skill)}
                                </span>

                                <h1>
                                    Reading Assessment
                                </h1>

                                <p className="assessment-question-count">
                                    Question{" "}
                                    {question.questionNumber}
                                    {" "}of{" "}
                                    {question.totalQuestions}
                                </p>
                            </div>
                        </div>

                        <div className="assessment-progress-info">
                            <strong>
                                {question.questionNumber}
                                {" / "}
                                {question.totalQuestions}
                            </strong>

                            <span>
                                {progress}% Complete
                            </span>
                        </div>
                    </div>

                    {/* PROGRESS BAR */}

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${progress}%`
                            }}
                        />
                    </div>

                    {/* ASSESSMENT QUESTION */}

                    <div className="assessment-question-card">

                        <AccessibleReading
                            key={question.questionId}
                            speechText={questionSpeechText}
                            onReadAloud={() => {
                                usedReadAloud.current = true;
                            }}
                        >

                            {/* READING PASSAGE */}

                            {question.passage && (
                                <GuidedPassage
                                    key={question.questionId}
                                    text={question.passage}
                                    className="assessment-passage"
                                />
                            )}

                            {/* QUESTION */}

                            <h2 className="assessment-question-text">
                                {question.question}
                            </h2>

                            {/* ANSWER OPTIONS */}

                            <div className="assessment-options">
                                {Object.entries(
                                    question.options
                                ).map(([key, value]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={
                                            selectedOption === key
                                                ? "assessment-option selected"
                                                : "assessment-option"
                                        }
                                        disabled={submitting}
                                        aria-pressed={
                                            selectedOption === key
                                        }
                                        onClick={() =>
                                            setSelectedOption(key)
                                        }
                                    >
                                        <span className="option-letter">
                                            {key}
                                        </span>

                                        <span className="option-text">
                                            {value}
                                        </span>

                                        {selectedOption === key && (
                                            <span
                                                className="option-selected-check"
                                                aria-hidden="true"
                                            >
                                                ✓
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                        </AccessibleReading>

                        {/* ERROR MESSAGE */}

                        {error && (
                            <div
                                className="form-error"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        {/* QUESTION ACTIONS */}

                        <div className="assessment-question-actions">
                            <button
                                type="button"
                                className="primary-form-button"
                                disabled={
                                    !selectedOption ||
                                    submitting
                                }
                                onClick={handleSubmit}
                            >
                                {submitting
                                    ? "Saving..."
                                    : question.questionNumber ===
                                    question.totalQuestions
                                        ? "Finish Assessment →"
                                        : "Next Question →"}
                            </button>
                        </div>

                    </div>

                </section>
            </main>
        </>
    );
}

function formatSkillName(skill: string): string {
    return skill
        .toLowerCase()
        .split("_")
        .map(
            word =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
}

export default AssessmentSession;
