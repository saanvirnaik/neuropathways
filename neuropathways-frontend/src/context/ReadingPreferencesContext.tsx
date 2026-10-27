import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode
} from "react";

import {
    DEFAULT_READING_PREFERENCES,
    type ReadingPreferences
} from "./readingPreferences";

import {
    ReadingPreferencesContext
} from "./readingPreferencesContextValue";

const STORAGE_PREFIX = "neuropathways-reading-preferences";

function getStorageKey(): string {
    try {
        const storedUser = localStorage.getItem(
            "neuropathwaysUser"
        );

        if (storedUser) {
            const user: unknown = JSON.parse(storedUser);

            if (
                typeof user === "object" &&
                user !== null
            ) {
                const record = user as Record<string, unknown>;

                // Prefer a stable user ID over an email address.
                const userId = record.id ?? record.userId;

                if (
                    typeof userId === "number" ||
                    typeof userId === "string"
                ) {
                    return `${STORAGE_PREFIX}-${userId}`;
                }
            }
        }
    } catch {
        // Use the default key if user information
        // cannot be read.
    }

    return `${STORAGE_PREFIX}-guest`;
}

function loadPreferences(
    storageKey: string
): ReadingPreferences {
    try {
        const saved = localStorage.getItem(storageKey);

        if (!saved) {
            return { ...DEFAULT_READING_PREFERENCES };
        }

        const parsed: unknown = JSON.parse(saved);

        if (
            typeof parsed !== "object" ||
            parsed === null ||
            Array.isArray(parsed)
        ) {
            return { ...DEFAULT_READING_PREFERENCES };
        }

        const data = parsed as Record<string, unknown>;

        const result = { ...DEFAULT_READING_PREFERENCES };

        for (const key of Object.keys(result) as
            (keyof ReadingPreferences)[]) {
            const value = data[key];

            if (key === "textSize") {
                if (
                    typeof value === "number" &&
                    Number.isFinite(value)
                ) {
                    result.textSize = Math.max(
                        16,
                        Math.min(32, value)
                    );
                }
            } else if (typeof value === "boolean") {
                // All other preference fields are booleans.
                switch (key) {
                    case "readableFont":
                        result.readableFont = value;
                        break;
                    case "softBackground":
                        result.softBackground = value;
                        break;
                    case "textToSpeech":
                        result.textToSpeech = value;
                        break;
                    case "focusMode":
                        result.focusMode = value;
                        break;
                    case "readingGuide":
                        result.readingGuide = value;
                        break;
                    case "moreSpacing":
                        result.moreSpacing = value;
                        break;
                    case "flexiblePace":
                        result.flexiblePace = value;
                        break;
                }
            }
        }

        return result;
    } catch {
        return { ...DEFAULT_READING_PREFERENCES };
    }
}

function applyReadingStyles(
    preferences: ReadingPreferences
): void {
    const root = document.documentElement;

    root.style.setProperty(
        "--reading-font-size",
        `${preferences.textSize}px`
    );

    root.style.setProperty(
        "--reading-line-height",
        preferences.moreSpacing ? "2.1" : "1.7"
    );

    root.style.setProperty(
        "--reading-letter-spacing",
        preferences.moreSpacing ? "0.04em" : "normal"
    );

    root.style.setProperty(
        "--reading-word-spacing",
        preferences.moreSpacing ? "0.15em" : "normal"
    );

    root.style.setProperty(
        "--reading-background",
        preferences.softBackground ? "#fffaf0" : "#ffffff"
    );

    root.style.setProperty(
        "--reading-font-family",
        preferences.readableFont
            ? "Verdana, Arial, sans-serif"
            : "Arial, sans-serif"
    );

    root.dataset.readingFocusMode =
        String(preferences.focusMode);

    root.dataset.readingGuide =
        String(preferences.readingGuide);

    root.dataset.readingTextToSpeech =
        String(preferences.textToSpeech);

    root.dataset.readingFlexiblePace =
        String(preferences.flexiblePace);
}

export function ReadingPreferencesProvider({
                                               children
                                           }: {
    children: ReactNode;
}) {
    const [storageKey, setStorageKey] = useState(
        () => getStorageKey()
    );

    const [preferences, setPreferences] =
        useState<ReadingPreferences>(
            () => loadPreferences(getStorageKey())
        );

    // Reload preferences when the signed-in user changes.
    useEffect(() => {
        function handleUserChange() {
            const nextKey = getStorageKey();

            setStorageKey(currentKey => {
                if (currentKey !== nextKey) {
                    setPreferences(loadPreferences(nextKey));
                    return nextKey;
                }

                return currentKey;
            });
        }

        window.addEventListener(
            "neuropathways-auth-changed",
            handleUserChange
        );

        window.addEventListener(
            "storage",
            handleUserChange
        );

        return () => {
            window.removeEventListener(
                "neuropathways-auth-changed",
                handleUserChange
            );

            window.removeEventListener(
                "storage",
                handleUserChange
            );
        };
    }, []);

    // Persist changes and update CSS variables.
    useEffect(() => {
        try {
            localStorage.setItem(
                storageKey,
                JSON.stringify(preferences)
            );
        } catch {
            // Storage may be unavailable in some browsers.
        }

        applyReadingStyles(preferences);
    }, [preferences, storageKey]);

    const updatePreference = useCallback(
        <K extends keyof ReadingPreferences>(
            key: K,
            value: ReadingPreferences[K]
        ) => {
            setPreferences(current => ({
                ...current,
                [key]: value
            }));
        },
        []
    );

    const updatePreferences = useCallback(
        (updates: Partial<ReadingPreferences>) => {
            setPreferences(current => ({
                ...current,
                ...updates
            }));
        },
        []
    );

    const resetPreferences = useCallback(() => {
        setPreferences({
            ...DEFAULT_READING_PREFERENCES
        });
    }, []);

    const contextValue = useMemo(
        () => ({
            preferences,
            updatePreference,
            updatePreferences,
            resetPreferences
        }),
        [
            preferences,
            updatePreference,
            updatePreferences,
            resetPreferences
        ]
    );

    return (
        <ReadingPreferencesContext.Provider
            value={contextValue}
        >
            {children}
        </ReadingPreferencesContext.Provider>
    );
}
