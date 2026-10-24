import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { authenticatedFetch } from "../services/api";
import "./AssessmentResults.css";

type Result = {
    sessionId: number; overallScore: number; calculatedLevel: number;
    skills: { skill: string; scorePercent: number; correctAnswers: number; totalQuestions: number; status: string }[];
};
const label = (value: string) => value.toLowerCase().replaceAll("_", " ");

export default function AssessmentResults() {
    const { sessionId } = useParams();
    const [result, setResult] = useState<Result | null>(null);
    const [error, setError] = useState("");
    useEffect(() => {
        const controller = new AbortController();
        setResult(null);
        setError("");
        async function load() {
            try {
                if (!sessionId || !/^\d+$/.test(sessionId)) throw new Error("Invalid assessment session.");
                const response = await authenticatedFetch(`/assessment-sessions/${sessionId}/results`, { signal: controller.signal });
                if (response.status === 401) throw new Error("Please sign in again to view your results.");
                if (!response.ok) throw new Error("These results are not available. Check that your assessment is complete.");
                const data: Result = await response.json();
                if (!controller.signal.aborted) setResult(data);
            } catch (cause) {
                if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Unable to load results.");
            }
        }
        void load();
        return () => controller.abort();
    }, [sessionId]);
    return <><Navbar/><main className="assessment-results">
        <h1>Your reading assessment</h1>
        {!result && !error && <p role="status">Loading your results…</p>}
        {error && <div role="alert"><p>{error}</p><Link to="/login">Sign in</Link></div>}
        {result && <>
            <p>Assessment complete. Here is your starting point for continued practice.</p>
            <div className="results-summary"><p><strong>{result.overallScore}%</strong><span>Overall score</span></p>
                <p><strong>{result.calculatedLevel}</strong><span>Reading level</span></p></div>
            <h2>Results by skill</h2>
            <ul className="results-skills">{result.skills.map(skill => <li key={skill.skill}>
                <h3>{label(skill.skill)}</h3><p>{skill.correctAnswers} of {skill.totalQuestions} correct · {skill.scorePercent}%</p>
                <p className="results-status">{label(skill.status)}</p>
            </li>)}</ul>
            <p>These results guide practice and are not a clinical diagnosis.</p>
        </>}
        <p><Link to="/dashboard">Continue to your dashboard</Link></p>
    </main></>;
}
