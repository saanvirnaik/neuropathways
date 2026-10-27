import { createContext } from "react";
import type { ReadingPreferences } from "./readingPreferences";

export type ReadingPreferencesContextType = {
    preferences: ReadingPreferences;

    updatePreference: <K extends keyof ReadingPreferences>(
        key: K,
        value: ReadingPreferences[K]
    ) => void;

    updatePreferences: (
        updates: Partial<ReadingPreferences>
    ) => void;

    resetPreferences: () => void;
};

export const ReadingPreferencesContext =
    createContext<ReadingPreferencesContextType | undefined>(
        undefined
    );