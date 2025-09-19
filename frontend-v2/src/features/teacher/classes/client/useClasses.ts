import { useState, useEffect, useCallback } from "react";
import {
    getClasses,
    createClass,
    renameClass,
    deleteClass,
} from "../services/classService";
import type { Class } from "@/features/teacher/common/types/class";

export function useClasses() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setClasses(await getClasses());
        } catch (err) {
            setError(err as Error);
            setClasses([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const addClass = useCallback(async (name: string) => {
        const newItem = await createClass(name);
        setClasses((prev) => [newItem, ...prev]);
    }, []);

    const doRename = useCallback(async (id: number, name: string) => {
        await renameClass(id, name);
        setClasses((prev) =>
            prev.map((c) => (c.id === id ? { ...c, name } : c))
        );
    }, []);

    const doDelete = useCallback(async (id: number) => {
        await deleteClass(id);
        setClasses((prev) => prev.filter((c) => c.id !== id));
    }, []);

    return {
        classes,
        loading,
        error,
        refresh: load,
        addClass,
        doRename,
        doDelete,
    };
}
