import { authenticatedFetch } from "./api";

export type AssessmentSessionResponse = {
    sessionId: number;
    status: string;
    currentQuestionNumber: number;
    totalQuestions: number;
};

export type AssessmentStatusResponse = {
    status:
        | "NOT_STARTED"
        | "IN_PROGRESS"
        | "COMPLETED";

    sessionId: number | null;

    currentQuestionNumber: number;

    totalQuestions: number;
};

export type AssessmentQuestion = {
    questionId: number;
    skill: string;
    questionNumber: number;
    totalQuestions: number;
    passage: string | null;
    question: string;
    options: Record<string, string>;
};

export type SubmitAssessmentAnswerRequest = {
    questionId: number;
    selectedOption: string;
    responseTimeMs: number;
    usedReadAloud: boolean;
};

export async function startAssessment():
    Promise<AssessmentSessionResponse> {

    const response =
        await authenticatedFetch(
            "/assessment-sessions",
            {
                method: "POST",
            }
        );

    if (!response.ok) {
        throw new Error(
            `Unable to start assessment. Status: ${response.status}`
        );
    }

    return response.json();
}

export async function getCurrentQuestion(
    sessionId: number
): Promise<AssessmentQuestion> {

    const response =
        await authenticatedFetch(
            `/assessment-sessions/${sessionId}/current-question`
        );

    if (!response.ok) {
        throw new Error(
            `Unable to load question. Status: ${response.status}`
        );
    }

    return response.json();
}

export async function submitAssessmentAnswer(
    sessionId: number,
    request: SubmitAssessmentAnswerRequest
): Promise<AssessmentStatusResponse> {

    const response =
        await authenticatedFetch(
            `/assessment-sessions/${sessionId}/answers`,
            {
                method: "POST",

                body: JSON.stringify(
                    request
                ),
            }
        );

    if (!response.ok) {
        throw new Error(
            `Unable to save answer. Status: ${response.status}`
        );
    }

    return response.json();
}

export type AssessmentSkillResult = {
    skill: string;
    correctAnswers: number;
    totalQuestions: number;
    scorePercent: number;
    status: string;
};

export type AssessmentResultResponse = {
    sessionId: number;
    overallScore: number;
    calculatedLevel: number;
    skills: AssessmentSkillResult[];
};


export async function getAssessmentResults(
    sessionId: number
): Promise<AssessmentResultResponse> {
    const response = await authenticatedFetch(
        `/assessment-sessions/${sessionId}/results`,
        {
            method: "GET"
        }
    );

    if (!response.ok) {
        throw new Error(
            `Unable to load assessment results. Status: ${response.status}`
        );
    }

    const contentType =
        response.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
        throw new Error(
            "The assessment API returned an unexpected response."
        );
    }

    return response.json();
}

export async function getAssessmentStatus():
    Promise<AssessmentStatusResponse> {

    const response = await authenticatedFetch(
        "/assessment-sessions/status"
    );

    if (!response.ok) {
        throw new Error(
            `Unable to load assessment status: ${response.status}`
        );
    }

    return response.json();
}