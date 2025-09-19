"use client";

import { useState, useCallback, useEffect } from "react";
import {
    getAssignment,
    editAssignment,
    deleteAssignment,
    createQuestion,
    updateQuestion as apiUpdateQuestion,
    deleteQuestion as apiDeleteQuestion,
    reorderQuestions as apiReorderQuestions,
} from "@/features/teacher/common/services/assignments";
import { AssignmentPayload } from "@/features/teacher/common/types/sections";

export function useAssignment(
    classId: number,
    sectionId: number,
    assignmentId: number
) {
    const [assignment, setAssignment] = useState<AssignmentPayload | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchAssignment = useCallback(async () => {
        if (!assignmentId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await getAssignment(classId, sectionId, assignmentId);
            data.questions = data.questions.slice().sort((a, b) => a.sequence - b.sequence);
            setAssignment(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [classId, sectionId, assignmentId]);

    useEffect(() => {
        void fetchAssignment();
    }, [fetchAssignment]);

    const doEditAssignment = useCallback(
        async (payload: { title: string; description?: string }) => {
            if (!assignmentId || !assignment) throw new Error("No assignment loaded");
            setLoading(true);
            try {
                await editAssignment(
                    classId,
                    sectionId,
                    assignmentId,
                    {
                        title: payload.title,
                        description: payload.description,
                        questions: assignment.questions,
                    }
                );
            } finally {
                setLoading(false);
            }
        },
        [classId, sectionId, assignmentId, assignment]
    );

    const doDeleteAssignment = useCallback(async () => {
        if (!assignmentId) throw new Error("No assignmentId");
        setLoading(true);
        try {
            await deleteAssignment(classId, sectionId, assignmentId);
            setAssignment(null);
        } finally {
            setLoading(false);
        }
    }, [classId, sectionId, assignmentId]);

    const doAddQuestion = useCallback(async () => {
        if (!assignmentId) throw new Error("No assignmentId");
        setLoading(true);
        try {
            const newQ = await createQuestion(classId, sectionId, assignmentId, { question: "", answer: "" });
            setAssignment((a) => (a ? { ...a, questions: [...a.questions, newQ] } : a));
            return newQ;
        } finally {
            setLoading(false);
        }
    }, [classId, sectionId, assignmentId]);

    const doUpdateQuestion = useCallback(
        async (qId: number, data: { questionText: string; answerKey?: string }) => {

            await apiUpdateQuestion(classId, sectionId, assignmentId, qId, { question: data.questionText, answer: data.answerKey || "" });

        },
        [classId, sectionId, assignmentId]
    );

    const doDeleteQuestion = useCallback(async (qId: number) => {
        setLoading(true);
        try {
            await apiDeleteQuestion(classId, sectionId, assignmentId, qId);
            setAssignment((a) =>
                a
                    ? {
                        ...a,
                        questions: a.questions
                            .filter((q) => q.id !== qId)
                            .map((q, idx) => ({ ...q, sequence: idx + 1 })),
                    }
                    : a
            );
        } finally {
            setLoading(false);
        }
    }, [classId, sectionId, assignmentId]);

    const doReorderQuestions = useCallback(
        async (ids: number[]) => {
            if (!assignmentId) throw new Error("No assignmentId");
            setLoading(true);
            try {
                await apiReorderQuestions(classId, sectionId, assignmentId, ids);
                await fetchAssignment();
            } finally {
                setLoading(false);
            }
        },
        [classId, sectionId, assignmentId, fetchAssignment]
    );

    return {
        assignment,
        loading,
        error,
        refetch: fetchAssignment,
        doEditAssignment,
        doDeleteAssignment,
        doAddQuestion,
        doUpdateQuestion,
        doDeleteQuestion,
        doReorderQuestions,
    };
}
