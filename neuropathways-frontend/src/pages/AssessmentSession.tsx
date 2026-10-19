import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import {
    getCurrentQuestion,
    submitAssessmentAnswer,
} from "../services/assessmentService";

import type {
    AssessmentQuestion,
} from "../services/assessmentService";

function AssessmentSession() {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [question, setQuestion] =
        useState<AssessmentQuestion | null>(null);

    const [selectedOption, setSelectedOption] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [questionStartedAt, setQuestionStartedAt] =
        useState<number>(Date.now());

    const [usedReadAloud, setUsedReadAloud] =
        useState(false);

    useEffect(() => {
        async function loadQuestion() {
            if (!sessionId) {
                setError("Assessment session not found.");
                setLoading(false);
                return;
            }

            try {
                const data = await getCurrentQuestion(
                    Number(sessionId)
                );

                setQuestion(data);
                setSelectedOption("");
                setQuestionStartedAt(Date.now());
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError(
                        "Unable to load assessment question."
                    );
                }
            } finally {
                setLoading(false);
            }
        }

        loadQuestion();
    }, [sessionId]);

    const handleReadAloud = () => {
        if (!question) {
            return;
        }

        const text = [
            question.passage,
            question.question,
        ]
            .filter(Boolean)
            .join(". ");

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(text);

        utterance.rate = 0.9;

        window.speechSynthesis.speak(
            utterance
        );

        setUsedReadAloud(true);
    };

    const handleSubmit = async () => {
        if (
            !question ||
            !sessionId ||
            !selectedOption
        ) {
            return;
        }

        setSubmitting(true);
        setError("");

        try {
            const responseTimeMs =
                Date.now() - questionStartedAt;

            const status =
                await submitAssessmentAnswer(
                    Number(sessionId),
                    {
                        questionId:
                        question.questionId,

                        selectedOption,

                        responseTimeMs,

                        usedReadAloud,
                    }
                );

            if (
                status.status === "COMPLETED"
            ) {
                navigate(
                    `/assessment/session/${sessionId}/results`
                );
                return;
            }

            const nextQuestion =
                await getCurrentQuestion(
                    Number(sessionId)
                );

            setQuestion(nextQuestion);
            setSelectedOption("");
            setUsedReadAloud(false);
            setQuestionStartedAt(Date.now());
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(
                    "Unable to submit your answer."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="assessment-page">
                    <div className="dashboard-loading">
                        Loading assessment...
                    </div>
                </main>
            </>
        );
    }

    if (error || !question) {
        return (
            <>
                <Navbar />

                <main className="assessment-page">
                    <div className="dashboard-error">
                        <h2>
                            We couldn't load this question.
                        </h2>

                        <p>
                            {error ||
                                "Please try again."}
                        </p>
                    </div>
                </main>
            </>
        );
    }

    const progress =
        Math.round(
            ((question.questionNumber - 1) /
                question.totalQuestions) *
            100
        );

    return (
        <>
            <Navbar />

            <main className="assessment-page">
                <section className="assessment-session-container">

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
                                    Question {question.questionNumber} of{" "}
                                    {question.totalQuestions}
                                </p>
                            </div>
                        </div>

                        <div className="assessment-progress-info">
                            <strong>
                                {question.questionNumber} /{" "}
                                {question.totalQuestions}
                            </strong>

                            <span>
                            {progress}% Complete
                        </span>
                        </div>
                    </div>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{
                                width: `${progress}%`,
                            }}
                        />
                    </div>

                    <div className="assessment-question-card">

                        <div className="assessment-question-toolbar">

                            <button
                                type="button"
                                className="assessment-audio-button"
                                onClick={handleReadAloud}
                            >
                            <span className="assessment-audio-icon">
                                🔊
                            </span>

                                <span>
                                Read Aloud
                            </span>
                            </button>

                        </div>

                        {question.passage && (
                            <div className="assessment-passage">
                                {question.passage}
                            </div>
                        )}

                        <h2 className="assessment-question-text">
                            {question.question}
                        </h2>

                        <div className="assessment-options">

                            {Object.entries(
                                question.options
                            ).map(
                                ([key, value]) => (

                                    <button
                                        key={key}
                                        type="button"
                                        className={
                                            selectedOption === key
                                                ? "assessment-option selected"
                                                : "assessment-option"
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
                                            <span className="option-selected-check">
                                            ✓
                                        </span>
                                        )}
                                    </button>

                                )
                            )}

                        </div>

                        {error && (
                            <div className="form-error">
                                {error}
                            </div>
                        )}

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

function formatSkillName(
    skill: string
) {
    return skill
        .toLowerCase()
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() +
                word.slice(1)
        )
        .join(" ");
}

export default AssessmentSession;