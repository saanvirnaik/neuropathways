
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import AssessmentResultsView, {
    type SkillResult
} from "../components/AssessmentResultsView";

import {
    getAssessmentResults,
    type AssessmentResultResponse
} from "../services/assessmentService";

import "../styles/assessmentresultsview.css";

function AssessmentResults() {
    const { sessionId } = useParams<{ sessionId: string }>();
    const navigate = useNavigate();

    const [results, setResults] =
        useState<AssessmentResultResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const id = Number(sessionId);

        // Invalid session IDs are handled during rendering.
        if (!sessionId || !Number.isSafeInteger(id) || id <= 0) {
            return;
        }

        let active = true;

        const loadResults = async () => {
            try {
                const data = await getAssessmentResults(id);

                if (active) {
                    setResults(data);
                }
            } catch (err) {
                if (active) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Unable to load assessment results."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        };

        void loadResults();

        return () => {
            active = false;
        };
    }, [sessionId]);


    if (loading) {
        return (
            <>
                <Navbar />
                <main className="assessment-results-message">
                    <h1>Loading Your Results...</h1>
                    <p>
                        Preparing your reading assessment summary.
                    </p>
                </main>
                <Footer />
            </>
        );
    }

    if (error || !results) {
        return (
            <>
                <Navbar />
                <main className="assessment-results-message">
                    <h1>Unable to Load Results</h1>

                    <p role="alert">
                        {error ?? "Assessment results are unavailable."}
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/dashboard")}
                    >
                        Back to Dashboard
                    </button>
                </main>
                <Footer />
            </>
        );
    }

    const skills: SkillResult[] = results.skills.map(
        (skill) => ({
            name: skill.skill
                .toLowerCase()
                .replace(/\b\w/g, (letter) => letter.toUpperCase()),

            correct: skill.correctAnswers,
            total: skill.totalQuestions,
            percentage: skill.scorePercent,
            status: skill.status
        })
    );

    return (
        <>
            <Navbar />

            <AssessmentResultsView
                overallScore={results.overallScore}
                readingLevel={results.calculatedLevel}
                skills={skills}
                onDashboard={() => navigate("/dashboard")}
            />

            <Footer />
        </>
    );
}

export default AssessmentResults;
