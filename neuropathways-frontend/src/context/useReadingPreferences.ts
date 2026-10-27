import { useContext } from "react";

import {
    ReadingPreferencesContext
} from "./readingPreferencesContextValue";

export function useReadingPreferences() {
    const context = useContext(ReadingPreferencesContext);

    if (!context) {
        throw new Error(
            "useReadingPreferences must be used inside " +
            "ReadingPreferencesProvider."
        );
    }

    return context;
}