
import type {
    AssessmentResultResponse
} from "./assessmentService";

export type PathwayStatus =
    | "strong"
    | "focus"
    | "available"
    | "upcoming";

export type LearningPathLevel = {
    level: number;
    title: string;
    description: string;
    status: PathwayStatus;
    score?: number;
};

export type PersonalizedLearningPath = {
    startingLevel: number;
    overallScore: number;
    levels: LearningPathLevel[];
};

const LEVELS = [
    {
        level: 1,
        title: "Sound & Letter Patterns",
        description:
            "Recognize common sounds, letters, and basic word patterns.",
        skills: ["DECODING"]
    },
    {
        level: 2,
        title: "Word Decoding",
        description:
            "Break unfamiliar words into smaller parts and sound them out.",
        skills: ["DECODING"]
    },
    {
        level: 3,
        title: "Vocabulary in Context",
        description:
            "Use clues in a sentence to understand unfamiliar words.",
        skills: ["VOCABULARY"]
    },
    {
        level: 4,
        title: "Reading Fluency",
        description:
            "Build smoother reading with improved pacing and accuracy.",
        skills: ["FLUENCY"]
    },
    {
        level: 5,
        title: "Reading Comprehension",
        description:
            "Understand main ideas, details, sequence, and meaning.",
        skills: ["COMPREHENSION"]
    },
    {
        level: 6,
        title: "Inference & Deeper Meaning",
        description:
            "Use evidence and clues to understand ideas not directly stated.",
        skills: ["INFERENCE"]
    }
] as const;

export function buildLearningPath(
    assessment: AssessmentResultResponse
): PersonalizedLearningPath {

    const startingLevel = Math.max(
        1,
        Math.min(6, assessment.calculatedLevel)
    );

    const skills = new Map(
        assessment.skills.map((skill) => [
            skill.skill.toUpperCase(),
            skill
        ])
    );

    const levels: LearningPathLevel[] =
        LEVELS.map((definition) => {

            const relevantSkills = definition.skills
                .map((name) => skills.get(name))
                .filter((skill) => skill !== undefined);

            const hasWeakSkill = relevantSkills.some(
                (skill) => skill.status !== "STRONG"
            );

            const allStrong =
                relevantSkills.length > 0 &&
                relevantSkills.every(
                    (skill) => skill.status === "STRONG"
                );

            let status: PathwayStatus = "available";

            if (hasWeakSkill) {
                status = "focus";
            } else if (allStrong) {
                status = "strong";
            } else if (definition.level > startingLevel) {
                status = "upcoming";
            }

            const score =
                relevantSkills.length > 0
                    ? Math.round(
                        relevantSkills.reduce(
                            (sum, skill) =>
                                sum + skill.scorePercent,
                            0
                        ) / relevantSkills.length
                    )
                    : undefined;

            return {
                level: definition.level,
                title: definition.title,
                description: definition.description,
                status,
                score
            };
        });

    return {
        startingLevel,
        overallScore: assessment.overallScore,
        levels
    };
}
