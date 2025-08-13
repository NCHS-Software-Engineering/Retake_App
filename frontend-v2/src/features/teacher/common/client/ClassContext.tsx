"use client";

import React, {
    createContext,
    useState,
    useEffect,
    ReactNode,
    useCallback,
} from "react";
import { ClassContextValue } from "../types/class";

const LS_KEYS = {
    CLASS: "classId",
    SECTION: "sectionId",
    ASSIGNMENT: "assignmentId",
    ATTEMPT: "attemptId",
    REQUEST: "requestId"
};

const defaultValue: ClassContextValue = {
    classId: null,
    setClassId: () => { },
    sectionId: null,
    setSectionId: () => { },
    assignmentId: null,
    setAssignmentId: () => { },
    requestId: null,
    setRequestId: () => { },
    attemptId: null,
    setAttemptId: () => { },
    reloadFromStorage: () => { },
};

export const ClassContext = createContext<ClassContextValue>(defaultValue);

export function ClassProvider({ children }: { children: ReactNode }) {
    const [classId, setClassIdState] = useState<number | null>(null);
    const [sectionId, setSectionIdState] = useState<number | null>(null);
    const [assignmentId, setAssignmentIdState] = useState<number | null>(null);
    const [attemptId, setAttemptIdState] = useState<number | null>(null);
    const [requestId, setRequestIdState] = useState<number | null>(null);

    const write = useCallback((key: string, value: number) => {
        try {
            localStorage.setItem(key, String(value));
        } catch {
            // ignore or report
        }
    }, []);

    const reloadFromStorage = useCallback(() => {
        try {
            const c = localStorage.getItem(LS_KEYS.CLASS);
            const s = localStorage.getItem(LS_KEYS.SECTION);
            const a = localStorage.getItem(LS_KEYS.ASSIGNMENT);
            const attempt = localStorage.getItem(LS_KEYS.ATTEMPT);
            const request = localStorage.get(LS_KEYS.REQUEST);
            if (c !== null) setClassIdState(Number(c));
            if (s !== null) setSectionIdState(Number(s));
            if (a !== null) setAssignmentIdState(Number(a));
            if(attempt !== null) setAttemptIdState(Number(attempt));
            if(request !== null) setRequestIdState(Number(request));
        } catch {
            // ignore or report
        }
    }, []);

    // On mount, hydrate state from localStorage
    useEffect(() => {
        reloadFromStorage();
    }, [reloadFromStorage]);

    const setClassId = useCallback(
        (id: number) => {
            setClassIdState(id);
            write(LS_KEYS.CLASS, id);
        },
        [write]
    );

    const setSectionId = useCallback(
        (id: number) => {
            setSectionIdState(id);
            write(LS_KEYS.SECTION, id);
        },
        [write]
    );

    const setAssignmentId = useCallback(
        (id: number) => {
            setAssignmentIdState(id);
            write(LS_KEYS.ASSIGNMENT, id);
        },
        [write]
    );

    const setAttemptId = useCallback(
        (id: number) => {
            setAttemptIdState(id);
            write(LS_KEYS.ATTEMPT, id);
        },
        [write]
    )

    const setRequestId = useCallback(
        (id: number) => {
            setRequestIdState(id);
            write(LS_KEYS.REQUEST, id);
        },
        [write]
    )

    return (
        <ClassContext.Provider
            value={{
                classId,
                setClassId,
                sectionId,
                setSectionId,
                assignmentId,
                setAssignmentId,
                requestId,
                setRequestId,
                attemptId,
                setAttemptId,
                reloadFromStorage,
            }}
        >
            {children}
        </ClassContext.Provider>
    );
}