export interface ClassContextValue {
    classId: number | null;
    setClassId: (id: number) => void;
    sectionId: number | null;
    setSectionId: (id: number) => void;
    assignmentId: number | null;
    setAssignmentId: (id: number) => void;
    requestId: number | null;
    setRequestId: (id: number) => void;
    attemptId: number | null; // Include attemptId in the type
    setAttemptId: (id: number) => void; // Include setter for attemptId
    reloadFromStorage: () => void;
};

export type Class = {
    id: number;
    name: string;
}