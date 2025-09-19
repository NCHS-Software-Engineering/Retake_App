import { useState, useEffect, useCallback } from 'react';
import {
    getSections,
    createSection,
    renameSection,
    deleteSection,
} from '@/features/teacher/common/services/sections';
import type { Section } from "@/features/teacher/common/types/sections";
import { useClass } from '@/features/teacher/common/client/useClass';

export function useSections() {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(false);
    const { classId } = useClass();

    const load = useCallback(async () => {
        if (!classId || classId <= 0) return;
        setLoading(true);
        try {
            // getSections now hits /api/classes/:classId/sections
            const { sections } = await getSections(classId);
            setSections(sections);
        } finally {
            setLoading(false);
        }
    }, [classId]);

    useEffect(() => {
        load();
    }, [load]);

    const addSection = useCallback(
        async (name: string) => {
            if (!classId || classId <= 0) throw new Error('Invalid classId');
            setLoading(true);
            try {
                // createSection already uses /api/classes/:classId/sections
                const newSec = await createSection(classId, name);
                setSections((prev) => [newSec, ...prev]);
                return newSec;
            } finally {
                setLoading(false);
            }
        },
        [classId]
    );

    const doRename = useCallback(
        async (sectionId: number, newName: string) => {
            if (!classId || classId <= 0) throw new Error('Invalid classId');
            setLoading(true);
            try {
                // now calls PUT /api/classes/:classId/sections/:sectionId
                await renameSection(classId, sectionId, newName);
                setSections((prev) =>
                    prev.map((s) =>
                        s.id === sectionId ? { ...s, name: newName } : s
                    )
                );
            } finally {
                setLoading(false);
            }
        },
        [classId]
    );

    const doDelete = useCallback(
        async (sectionId: number) => {
            if (!classId || classId <= 0) throw new Error('Invalid classId');
            setLoading(true);
            try {
                // now calls DELETE /api/classes/:classId/sections/:sectionId
                await deleteSection(classId, sectionId);
                setSections((prev) => prev.filter((s) => s.id !== sectionId));
            } finally {
                setLoading(false);
            }
        },
        [classId]
    );

    return { sections, loading, load, addSection, doRename, doDelete };
}
