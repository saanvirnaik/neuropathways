
import {
    useEffect,
    useRef,
    useState,
    type ReactNode
} from "react";

import {
    useReadingPreferences
} from "../context/useReadingPreferences";

import "../styles/accessiblereading.css";

type AccessibleReadingProps = {
    children: ReactNode;
    speechText?: string;
    className?: string;
    onReadAloud?: () => void;
};

export default function AccessibleReading({
                                              children,
                                              speechText,
                                              className = "",
                                              onReadAloud
                                          }: AccessibleReadingProps) {

    const { preferences } = useReadingPreferences();

    const [speaking, setSpeaking] = useState(false);

    // Tracks the current speech session to prevent
    // outdated speech callbacks from changing state.
    const speechSessionRef = useRef(0);

    // Stop speech when the question changes
    // or when the component is removed.
    useEffect(() => {
        return () => {
            speechSessionRef.current += 1;

            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, [speechText]);

    useEffect(() => {
        if (!preferences.textToSpeech) {
            speechSessionRef.current += 1;

            if ("speechSynthesis" in window) {
                window.speechSynthesis.cancel();
            }
        }
    }, [preferences.textToSpeech]);

    function stopSpeech() {
        speechSessionRef.current += 1;

        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }

        setSpeaking(false);
    }

    function startSpeech() {
        if (
            !speechText ||
            !("speechSynthesis" in window) ||
            !("SpeechSynthesisUtterance" in window)
        ) {
            return;
        }

        // Stop any existing narration.
        window.speechSynthesis.cancel();

        speechSessionRef.current += 1;

        const sessionId = speechSessionRef.current;

        const utterance = new SpeechSynthesisUtterance(
            speechText
        );

        // Slightly slower narration to support reading.
        utterance.rate = 0.85;
        utterance.pitch = 1;

        utterance.onstart = () => {
            if (speechSessionRef.current === sessionId) {
                setSpeaking(true);
            }
        };

        utterance.onend = () => {
            if (speechSessionRef.current === sessionId) {
                setSpeaking(false);
            }
        };

        utterance.onerror = () => {
            if (speechSessionRef.current === sessionId) {
                setSpeaking(false);
            }
        };

        // Preserve the existing backend tracking
        // for whether Read Aloud was used.
        onReadAloud?.();

        window.speechSynthesis.speak(utterance);

        setSpeaking(true);
    }

    return (
        <section
            className={[
                "accessible-reading",

                preferences.readableFont
                    ? "accessible-reading-font"
                    : "",

                preferences.softBackground
                    ? "accessible-reading-soft"
                    : "",

                preferences.moreSpacing
                    ? "accessible-reading-spaced"
                    : "",

                preferences.focusMode
                    ? "accessible-reading-focus"
                    : "",

                className
            ]
                .filter(Boolean)
                .join(" ")}

            style={{
                fontSize: `${preferences.textSize}px`
            }}
        >

            {/* =========================================
                READ ALOUD TOOLBAR
               ========================================= */}

            {(preferences.textToSpeech || preferences.focusMode) && (
                <div className="accessible-reading-toolbar">
                    <div className="accessible-reading-actions">

                    {preferences.textToSpeech && speechText && (
                        <button
                            type="button"
                            onClick={speaking ? stopSpeech : startSpeech}
                            aria-label={
                                speaking
                                    ? "Stop reading aloud"
                                    : "Read aloud"
                            }
                            aria-pressed={speaking}
                        >
                            {speaking
                                ? "■ Stop Reading"
                                : "🔊 Read Aloud"}
                        </button>
                    )}

                    {preferences.focusMode && (
                        <span className="accessible-focus-indicator">
                ◉ Focus Mode
            </span>
                    )}
                    </div>
                </div>
            )}

            {/* =========================================
                ACCESSIBLE READING CONTENT

                GuidedPassage is rendered by
                Practice.tsx and AssessmentSession.tsx
                inside this section.
               ========================================= */}

            <div className="accessible-reading-content">
                {children}
            </div>

        </section>
    );
}
