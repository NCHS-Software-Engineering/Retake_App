"use client";

import { useState, useCallback, useEffect } from "react";
import { QuestionPayload, Section } from "@/features/teacher/common/types/sections";
import { deleteSection, getSection, renameSection } from "@/features/teacher/common/services/sections";
import { createAssignment, deleteAssignment, editAssignment } from "@/features/teacher/common/services/assignments";

// Hook to load section data
export function useSection(classId: number, sectionId: number | null) {
    const [section, setSection] = useState<Section | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchSection = useCallback(async () => {
        if (!sectionId || sectionId <= 0) return;

        setLoading(true);
        setError(null);

        try {
            const data = await getSection(classId, sectionId);
            setSection(data);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [classId, sectionId]);

    useEffect(() => {
        void fetchSection();
    }, [fetchSection]);

    const doRenameSection = useCallback(
        async (newName: string) => {
            if (!sectionId || sectionId <= 0) throw new Error('Invalid sectionId');
            setLoading(true);

            try {
                // now calls PUT /api/classes/:classId/sections/:sectionId
                await renameSection(classId, sectionId, newName);
            } finally {
                setLoading(false);
            }

        }, [classId, sectionId]
    )

    const doDeleteSection = useCallback(
        async () => {
            if (!sectionId || sectionId <= 0) throw new Error('Invalid sectionId');
            setLoading(true);

            try {
                // now calls DELETE /api/classes/:classId/sections/:sectionId
                await deleteSection(classId, sectionId);
            } finally {
                setLoading(false);
            }
        }, [classId, sectionId]
    )

    const doEditAssignment = useCallback(async (assignmentId: number, data: { title: string, description?: string, questions?: QuestionPayload[] }) => {
        if (!sectionId || sectionId <= 0) throw new Error('Invalid sectionId');
        setLoading(true);
        try {
            await editAssignment(classId, sectionId, assignmentId, {
                title: data.title,
                description: data.description,
                questions: data.questions ?? []
            });
        } finally {
            setLoading(false);
        }
    }, [classId, sectionId]);

    const doDeleteAssignment = useCallback(async (assignmentId: number) => {
        if (!sectionId || sectionId <= 0) throw new Error('Invalid sectionId');
        setLoading(true);
        try {
            await deleteAssignment(classId, sectionId, assignmentId);
        } finally {
            setLoading(false);
        }
    }, [classId, sectionId]);

    const doCreateAssignment = useCallback(async (data: { title: string, description: string, type: string}) => {
        if (!sectionId || sectionId <= 0) throw new Error('Invalid sectionId');
        setLoading(true);
        try {
            await createAssignment(classId, sectionId, {
                type: data.type,
                title: data.title,
                description: data.description
            });
        } finally {
            setLoading(false);
        }
    }, [classId, sectionId]);

    return { section, loading, error, doRenameSection, doDeleteSection, doEditAssignment, doDeleteAssignment, doCreateAssignment, refetch: fetchSection };
}