export interface RetakeRequest {
    id: number;
    assignment?: {
        title: string;
    };
    teacher: { username: string; email: string; profile?: { profilePictureUrl?: string } };
    requestNotes: string;
    status: 'pending' | 'assigned' | 'submitted' | 'graded' | 'resolved';
    createdAt: string;
    attempts: Array<{ id: number; submittedAt: string; score: number | null; feedback: string | null }>;
}

export interface TeacherPayload { id: number; username: string; email: string }