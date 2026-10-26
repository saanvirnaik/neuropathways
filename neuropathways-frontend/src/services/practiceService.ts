
import { authenticatedFetch } from "./api";

export type PracticeSkill =
    | "DECODING"
    | "VOCABULARY"
    | "FLUENCY"
    | "COMPREHENSION"
    | "INFERENCE";

export type PracticeSessionStatus =
    | "IN_PROGRESS"
    | "COMPLETED";

export type PracticeSessionResponse = {
    sessionId: number;
    skill: PracticeSkill;
    difficulty: number;
    status: PracticeSessionStatus;
    totalQuestions: number;
};

export type PracticeQuestionResponse = {
    questionId: number;
    questionNumber: number;
    totalQuestions: number;
    skill: PracticeSkill;
    difficulty: number;
    passage: string | null;
    question: string;
    options: Record<string, string>;
};

export type SubmitPracticeAnswerRequest = {
    questionId: number;
    selectedOption: string;
    responseTimeMs: number;
    usedReadAloud: boolean;
};

export type PracticeAnswerFeedback = {
    correct: boolean;
    correctOption: string;
    explanation: string | null;
    completed: boolean;
    nextQuestionNumber: number | null;
};

export type PracticeResultsResponse = {
    sessionId: number;
    skill: PracticeSkill;
    difficulty: number;
    totalQuestions: number;
    correctAnswers: number;
    scorePercent: number;
};

export const PRACTICE_SKILLS: {
    id: PracticeSkill;
    title: string;
    description: string;
}[] = [
    {
        id: "DECODING",
        title: "Word Decoding",
        description: "Practice sounds and word patterns."
    },
    {
        id: "VOCABULARY",
        title: "Vocabulary",
        description: "Discover meanings using context clues."
    },
    {
        id: "FLUENCY",
        title: "Reading Fluency",
        description: "Build reading accuracy and expression."
    },
    {
        id: "COMPREHENSION",
        title: "Comprehension",
        description: "Understand important details and ideas."
    },
    {
        id: "INFERENCE",
        title: "Inference",
        description: "Use clues to understand deeper meaning."
    }
];

async function parseResponse<T>(
    response: Response
): Promise<T> {
    if (!response.ok) {
        let message = `Request failed (${response.status}).`;

        if (response.status === 401) {
            message = "Your session has expired. Please log in again.";
        } else if (response.status === 409) {
            message =
                "This practice session cannot continue, or questions " +
                "are not yet available at this difficulty.";
        } else {
            try {
                const errorBody: unknown = await response.json();

                if (
                    typeof errorBody === "object" &&
                    errorBody !== null &&
                    "message" in errorBody &&
                    typeof errorBody.message === "string"
                ) {
                    message = errorBody.message;
                }
            } catch {
                // Keep the default message.
            }
        }

        throw new Error(message);
    }

    return response.json() as Promise<T>;
}

export async function startPracticeSession(
    skill: PracticeSkill
): Promise<PracticeSessionResponse> {
    const response = await authenticatedFetch(
        "/practice-sessions",
        {
            method: "POST",
            body: JSON.stringify({ skill })
        }
    );

    return parseResponse<PracticeSessionResponse>(response);
}

export async function getCurrentPracticeQuestion(
    sessionId: number
): Promise<PracticeQuestionResponse> {
    const response = await authenticatedFetch(
        `/practice-sessions/${sessionId}/current-question`
    );

    return parseResponse<PracticeQuestionResponse>(response);
}

export async function submitPracticeAnswer(
    sessionId: number,
    request: SubmitPracticeAnswerRequest
): Promise<PracticeAnswerFeedback> {
    const response = await authenticatedFetch(
        `/practice-sessions/${sessionId}/answers`,
        {
            method: "POST",
            body: JSON.stringify(request)
        }
    );

    return parseResponse<PracticeAnswerFeedback>(response);
}

export async function getPracticeResults(
    sessionId: number
): Promise<PracticeResultsResponse> {
    const response = await authenticatedFetch(
        `/practice-sessions/${sessionId}/results`
    );

    return parseResponse<PracticeResultsResponse>(response);
}
