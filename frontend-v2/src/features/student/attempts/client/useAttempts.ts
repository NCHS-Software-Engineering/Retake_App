import { useCallback, useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import {
    fetchAttempt, Attempt
} from "@/features/teacher/attempts/services/attemptService";
import {
    updateAnswer,
    submitAttempt,
} from "@/features/student/attempts/services/attemptsService";
import { useRouter } from "next/navigation";

type Answer = {
    id: number;
    answerText: string;
    isCorrect?: boolean | null;
    feedback?: string | null;
};

type Question = {
    id: number;
    sequence: number;
    questionText: string;
    answer: Answer;
};

type AttemptData = {
    feedback: string | null;
    score: number | null;
};

type AttemptResponse = Attempt & { questions: Question[] };

export default function useAttempts(
    requestId: number,
    takeId: number
) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [attempt, setAttempt] = useState<AttemptData | null>(null);
    const router = useRouter();

    const loadAttempt = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchAttempt(requestId, takeId) as AttemptResponse;
            setQuestions(data.questions as Question[]);
            setAttempt({
                feedback: data.feedback,
                score: data.score,
            });
            
        } catch (e) {
            console.error("Failed to load attempt:", e);
            setError("Failed to load attempt");
        } finally {
            setLoading(false);
        }
    }, [requestId, takeId]);

    useEffect(() => {
        loadAttempt();
    }, [loadAttempt]);

    const debouncedSave = useMemo( () =>
        debounce(async (answerId: number, text: string) => {
            try {
                await updateAnswer(requestId, takeId, answerId, text);
            } catch {
                setError("Failed to save answer");
            }
        }, 500),
        [requestId, takeId]
    );
    useEffect(() => {
        return () => {
            debouncedSave.cancel();
        };
    }, [debouncedSave]);

    const handleChange = (answerId: number, text: string) => {
        setQuestions((qs) =>
            qs.map((q) =>
                q.answer.id === answerId
                    ? { ...q, answer: { ...q.answer, answerText: text } }
                    : q
            )
        );
        debouncedSave(answerId, text);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await submitAttempt(requestId, takeId);
            router.push("/dashboard/student");
        } catch {
            setError("Failed to submit");
        } finally {
            setLoading(false);
        }
    };

    return {
        attempt,
        questions,
        loading,
        error,
        handleChange,
        handleSubmit,
    };
}