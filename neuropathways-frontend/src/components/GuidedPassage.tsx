
import { useEffect, useState } from "react";

import { useReadingPreferences } from
        "../context/useReadingPreferences";

import "../styles/guidedPassage.css";

type GuidedPassageProps = {
    text: string;
    className?: string;
};

function splitSentences(text: string): string[] {
    return (
        text
            .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
            ?.map(sentence => sentence.trim())
            .filter(Boolean) ?? []
    );
}

export default function GuidedPassage({
                                          text,
                                          className = ""
                                      }: GuidedPassageProps) {
    const { preferences } = useReadingPreferences();

    const [activeSentence, setActiveSentence] = useState(0);

    const sentences = splitSentences(text);

    useEffect(() => {
        // A keyed GuidedPassage remounts for each question.
        // This effect is intentionally unnecessary for resetting state.
    }, [text]);

    if (!text.trim()) {
        return null;
    }

    if (!preferences.readingGuide || sentences.length === 0) {
        return (
            <div className={className}>
                {text}
            </div>
        );
    }

    return (
        <div className={`guided-passage ${className}`}>
            <div className="guided-passage-text">
                {sentences.map((sentence, index) => (
                    <span
                        key={index}
                        className={
                            activeSentence === index
                                ? "guided-sentence active"
                                : "guided-sentence"
                        }
                    >
                        {sentence}{" "}
                    </span>
                ))}
            </div>

            {sentences.length > 1 && (
                <div className="guided-passage-controls">
                    <span className="guided-passage-progress">
                        Sentence {activeSentence + 1} of{" "}
                        {sentences.length}
                    </span>

                    <div className="guided-passage-buttons">
                        <button
                            type="button"
                            disabled={activeSentence === 0}
                            onClick={() =>
                                setActiveSentence(current =>
                                    Math.max(0, current - 1)
                                )
                            }
                        >
                            ← Previous
                        </button>

                        <button
                            type="button"
                            disabled={
                                activeSentence === sentences.length - 1
                            }
                            onClick={() =>
                                setActiveSentence(current =>
                                    Math.min(
                                        sentences.length - 1,
                                        current + 1
                                    )
                                )
                            }
                        >
                            Next →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
