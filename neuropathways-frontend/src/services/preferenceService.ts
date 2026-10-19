import { authenticatedFetch } from "./api";

export type LearnerPreferences = {
    fontSize: number;
    fontFamily: string;
    backgroundTheme: string;
    textToSpeech: boolean;
    focusMode: boolean;
    readingGuide: boolean;
    increasedSpacing: boolean;
    flexiblePace: boolean;
};

export async function getPreferences():
    Promise<LearnerPreferences> {

    const response =
        await authenticatedFetch(
            "/preferences/me"
        );

    if (!response.ok) {
        throw new Error(
            "Unable to load reading preferences."
        );
    }

    return response.json();
}

export async function savePreferences(
    preferences: LearnerPreferences
): Promise<LearnerPreferences> {

    const response =
        await authenticatedFetch(
            "/preferences/me",
            {
                method: "PUT",
                body: JSON.stringify(
                    preferences
                ),
            }
        );

    if (!response.ok) {
        throw new Error(
            "Unable to save reading preferences."
        );
    }

    return response.json();
}