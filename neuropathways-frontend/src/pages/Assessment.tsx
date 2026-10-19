import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import Navbar from "../components/Navbar";
import {startAssessment} from "../services/assessmentService";

function Assessment() {
    const navigate = useNavigate();

    const [fontSize, setFontSize] = useState(18);
    const [useReadableFont, setUseReadableFont] = useState(false);
    const [softBackground, setSoftBackground] = useState(false);

    const [starting, setStarting] = useState(false);
    const [error, setError] = useState("");

    const increaseFont = () => {
        setFontSize((current) =>
            Math.min(current + 2, 28)
        );
    };

    const decreaseFont = () => {
        setFontSize((current) =>
            Math.max(current - 2, 14)
        );
    };

    const readPageAloud = () => {
        const text =
            "Let's find the right place to begin. " +
            "You'll complete a few short reading activities. " +
            "There are no grades and no pressure. " +
            "Your answers help NeuroPathways understand " +
            "which skills you already have and what you should work on next.";

        window.speechSynthesis.cancel();

        const utterance =
            new SpeechSynthesisUtterance(text);

        utterance.rate = 0.9;

        window.speechSynthesis.speak(
            utterance
        );
    };

    const handleStartAssessment =
        async () => {
            setStarting(true);
            setError("");

            try {
                const session =
                    await startAssessment();

                navigate(
                    `/assessment/session/${session.sessionId}`
                );
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError(
                        "Unable to start assessment."
                    );
                }
            } finally {
                setStarting(false);
            }
        };

    const assessmentStyle = {
        fontSize: `${fontSize}px`,
        fontFamily: useReadableFont
            ? "Arial, Verdana, sans-serif"
            : "Inter, Arial, sans-serif",
        backgroundColor: softBackground
            ? "#fffaf0"
            : undefined,
    };

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    return (
        <>
            <Navbar/>

            <main
                className="assessment-page"
                style={assessmentStyle}
            >
                <section className="assessment-intro">

          <span className="eyebrow">
            YOUR STARTING POINT
          </span>

                    <h1>
                        Let&apos;s Find the Right Place
                        to Begin
                    </h1>

                    <p>
                        You&apos;ll complete a few short
                        reading activities. There are no
                        grades and no pressure. Your
                        answers help NeuroPathways
                        understand which skills you
                        already have and what you should
                        work on next.
                    </p>

                    <div className="assessment-info-grid">

                        <article>
                            <div className="assessment-icon">
                                ⏱
                            </div>

                            <h3>
                                About 10 Minutes
                            </h3>

                            <p>
                                Complete a few short activities
                                at your own pace.
                            </p>
                        </article>


                        <article>
                            <div className="assessment-icon">
                                📖
                            </div>

                            <h3>
                                Different Reading Skills
                            </h3>

                            <p>
                                We&apos;ll look at decoding,
                                vocabulary, fluency, and
                                comprehension.
                            </p>
                        </article>


                        <article>
                            <div className="assessment-icon">
                                🛤️
                            </div>

                            <h3>
                                Your Own Path
                            </h3>

                            <p>
                                Your results help create your
                                personalized learning pathway.
                            </p>
                        </article>

                    </div>


                    <div className="assessment-settings">

                        <h2>
                            Before You Begin
                        </h2>

                        <p>
                            Adjust the reading experience
                            so it feels comfortable.
                        </p>

                        <div className="setting-buttons">

                            <button
                                type="button"
                                onClick={decreaseFont}
                            >
                                A−
                            </button>

                            <button
                                type="button"
                                onClick={increaseFont}
                            >
                                A+
                            </button>

                            <button
                                type="button"
                                className={
                                    useReadableFont
                                        ? "setting-active"
                                        : ""
                                }
                                onClick={() =>
                                    setUseReadableFont(
                                        (current) => !current
                                    )
                                }
                            >
                                Readable Font
                            </button>

                            <button
                                type="button"
                                className={
                                    softBackground
                                        ? "setting-active"
                                        : ""
                                }
                                onClick={() =>
                                    setSoftBackground(
                                        (current) => !current
                                    )
                                }
                            >
                                Soft Background
                            </button>

                            <button
                                type="button"
                                onClick={readPageAloud}
                            >
                                🔊 Read Aloud
                            </button>

                        </div>

                    </div>


                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}


                    <button
                        type="button"
                        className="primary-form-button assessment-button"
                        onClick={handleStartAssessment}
                        disabled={starting}
                    >
                        {starting
                            ? "Starting Assessment..."
                            : "Start Assessment →"}
                    </button>

                </section>
            </main>
        </>
    );
}

export default Assessment;