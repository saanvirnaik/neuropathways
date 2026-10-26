
import { authenticatedFetch } from "./api";

export type LearningPathLevel = {
    level: number;
    title: string;
    description: string;
    skill: string;
    assessmentScore: number | null;
    assessmentStatus: string;
    pathwayStatus:
        | "STRONG"
        | "FOCUS"
        | "AVAILABLE"
        | "UPCOMING";
};

export type LearningPathResponse = {
    assessmentSessionId: number;
    startingLevel: number;
    overallScore: number;
    recommendedFocus: string | null;
    levels: LearningPathLevel[];
};

export async function getLearningPath():
    Promise<LearningPathResponse> {

    const response = await authenticatedFetch(
        "/learning-path",
        {
            method: "GET"
        }
    );

    if (!response.ok) {
        throw new Error(
            `Unable to load learning pathway. Status: ${response.status}`
        );
    }

    return response.json();
}
