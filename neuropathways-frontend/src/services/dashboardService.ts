import { authenticatedFetch } from "./api";

export type SkillProgress = {
    skill: string;
    mastery: number;
    status: string;
};

export type NextActivity = {
    id: number;
    title: string;
    skill: string;
    estimatedMinutes: number;
};

export type AssessmentStatus =
    | "NOT_STARTED"
    | "IN_PROGRESS"
    | "COMPLETED";

export type DashboardData = {
    userId: number;
    firstName: string;

    assessmentStatus:
        | "NOT_STARTED"
        | "IN_PROGRESS"
        | "COMPLETED";

    assessmentSessionId: number | null;
    assessmentCurrentQuestion: number | null;
    assessmentTotalQuestions: number | null;

    currentLevel: number | null;
    currentSkill: string | null;

    progressPercent: number | null;

    currentMastery: number | null;

    levelCheckEligible: boolean;

    levelCheckThreshold: number | null;

    streakDays: number | null;
    activitiesThisWeek: number | null;
    minutesThisWeek: number | null;
    skillsImproved: number | null;

    nextActivity: {
        id: number;
        title: string;
        skill: string;
        estimatedMinutes: number;
    } | null;

    skills: {
        skill: string;
        mastery: number;
        status: string;
    }[] | null;
};

export async function getDashboard():
    Promise<DashboardData> {

    const response =
        await authenticatedFetch(
            "/dashboard/me"
        );

    if (!response.ok) {
        throw new Error(
            `Unable to load dashboard. Status: ${response.status}`
        );
    }

    return response.json();
}