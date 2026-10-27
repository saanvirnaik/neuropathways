import type { LearnerPreferences } from "../services/preferenceService";
import type { ReadingPreferences } from "./readingPreferences";

export function mapLearnerPreferences(
    source: LearnerPreferences
): ReadingPreferences {
    return {
        textSize: source.fontSize,
        readableFont: source.fontFamily === "READABLE",
        softBackground: source.backgroundTheme === "SOFT",
        textToSpeech: source.textToSpeech,
        focusMode: source.focusMode,
        readingGuide: source.readingGuide,
        moreSpacing: source.increasedSpacing,
        flexiblePace: source.flexiblePace
    };
}