"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAttempt } from "./useAttempt";
import { Header } from "./Header";
import { SubmissionInfo } from "./SubmissionInfo";
import { QuestionCard } from "./QuestionCard";
import { FinalFeedback } from "./FinalFeedback";
import type { Answer } from "../services/attemptService";
import { saveAttemptScore } from "../services/attemptService";

export default function AttemptPage() {
    const params = useParams();
    const requestId = Number(params.requestId);
    const attemptId = Number(params.attemptId);
    const { data: attempt, loading, error } = useAttempt(requestId, attemptId);

    // State for answers and score
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [score, setScore] = useState(0);

    // Initialize answers when attempt loads
    useEffect(() => {
        if (attempt) {
            setAnswers(attempt.answers);
        }
    }, [attempt]);

    // Handler to update an answer (e.g., when isCorrect changes)
    const handleAnswerChange = (updatedAnswer: Answer) => {
        setAnswers((prev) =>
            prev.map((ans) => (ans.id === updatedAnswer.id ? { ...ans, ...updatedAnswer } : ans))
        );
    };

    // Tally score when answers change
    useEffect(() => {
        const updateScore = async () => {
            const total = answers.length;
            const correct = answers.filter((ans) => ans.isCorrect === true).length;
            const newScore = total > 0 ? parseFloat(((correct / total) * 100).toFixed(2)) : 0;
            setScore(newScore);
            await saveAttemptScore(requestId, attemptId, newScore);
        };
        updateScore();
    }, [answers, requestId, attemptId]);

    if (loading) return <p className="p-6">Loading...</p>;
    if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
    if (!attempt) return null;

    return (
        <div className="space-y-6">
            <Header
                assignment={attempt.request.assignment}
                student={attempt.student}
            />

            <SubmissionInfo
                submittedAt={attempt.submittedAt}
                score={score}
            />

            <div className="pt-4">
                {answers.map((ans) => (
                    <QuestionCard
                        key={ans.id}
                        requestId={requestId}
                        answer={ans}
                        onAnswerChange={handleAnswerChange}
                    />
                ))}
            </div>

            <FinalFeedback
                requestId={requestId}
                attemptId={attemptId}
                initialFeedback={attempt.feedback || ""}
            />
        </div>
    );
}
