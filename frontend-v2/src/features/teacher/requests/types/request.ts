export type Request = {
    id: number;
    studentId: number;
    assignmentId: number;
    requestNotes: string;
    status: 'pending' | 'assigned' | 'submitted' | 'graded' | 'resolved';
    createdAt: string;
    updatedAt: string;
    student?: {
        email: string;
        username: string;
        profile: { profilePictureUrl: string };
    };
    assignment?: { title: string };
};

export type StudentPayload = {
    id: number,
    email: string,
    username: string,
    profile: {
        profilePictureUrl: string | null,
    }
}

export type RequestPayload = {
    id: number;
    studentId: number;
    assignmentId: number;
    requestNotes: string;
    status: 'pending' | 'assigned' | 'submitted' | 'graded' | 'resolved';
    createdAt: string;
    updatedAt: string;
};

export type SubmissionAttemptPayload = {
    id: number,
    submittedAt: string,
    score: number | null,
    feedback: string | null,
}

export type NewRequestBody = {
    studentId: number;
    assignmentId: number;
    requestNotes: string;
};

export type Assignment = { id: number; type: string; title: string };
export type Section = { id: number; name: string; assignments: Assignment[] };
export type ClassData = { id: number; name: string; sections: Section[] };