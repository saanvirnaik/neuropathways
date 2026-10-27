export type ReadingPreferences = {
    textSize: number;
    readableFont: boolean;
    softBackground: boolean;
    textToSpeech: boolean;
    focusMode: boolean;
    readingGuide: boolean;
    moreSpacing: boolean;
    flexiblePace: boolean;
};

export const DEFAULT_READING_PREFERENCES: ReadingPreferences = {
    textSize: 20,
    readableFont: false,
    softBackground: false,
    textToSpeech: false,
    focusMode: false,
    readingGuide: false,
    moreSpacing: false,
    flexiblePace: true
};