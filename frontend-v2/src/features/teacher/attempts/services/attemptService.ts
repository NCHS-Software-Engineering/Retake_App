export interface AssignmentInfo {
    id: number;
    title: string;
    description: string;
    type: string;
}

export interface RequestInfo {
    id: number;
    assignment: AssignmentInfo;
}

export interface Profile {
    profilePictureUrl: string | null;
}

export interface StudentInfo {
    id: number;
    username: string;
    email: string;
    profile: Profile;
}

export interface Question {
    id: number;
    sequence: number;
    questionText: string;
    answerKey: string | null;
}

export interface Answer {
    id: number;
    answerText: string;
    feedback: string | null;
    question: Question;
    isCorrect?: boolean;
}

export interface Attempt {
    id: number;
    submittedAt: string;
    score: number | null;
    feedback: string | null;
    request: RequestInfo;
    student: StudentInfo;
    answers: Answer[];
  }
import { API_BASE } from "@/constants/env";
async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text();
        alert(text);
        throw new Error(`${res.status} — ${text}`);
    }
    return res.json();
}

export async function fetchAttempt(
    requestId: number,
    attemptId: number
): Promise<Attempt> {
    return fetch(`${API_BASE}/api/retake-requests/${requestId}/attempts/${attemptId}`, {
        credentials: "include"
    }).then(handleResponse<Attempt>);
}

export async function applyCorrectStatusToQuestion(requestId: number, answerId: number, isCorrect: boolean) {
    return fetch(`${API_BASE}/api/retake-requests/${requestId}/attempts/answer/${answerId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCorrect }),
    }).then(handleResponse<Attempt>);
}

export async function setTeacherFeedbackToQuestion(requestId: number, answerId: number, feedback: string) {
    // Go to route and send the feedback in the body
    return fetch(`${API_BASE}/api/retake-requests/${requestId}/attempts/answer/${answerId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
    }).then(handleResponse<Attempt>);
}

export async function setFinalFeedback(requestId: number, attemptId: number, feedback: string) {
    // go to route, send feedback in body
    return fetch(`${API_BASE}/api/retake-requests/${requestId}/attempts/${attemptId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback }),
    }).then(handleResponse<Attempt>);
}

export async function updateAttemptToGraded(requestId: number, attemptId: number) {
    return fetch(`${API_BASE}/api/retake-requests/${requestId}/attempts/${attemptId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    }).then(handleResponse<Attempt>);
}

export async function saveAttemptScore(requestId: number, attemptId: number, score: number) {
    return fetch(`${API_BASE}/api/retake-requests/${requestId}/attempts/${attemptId}/score`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score }),
    }).then(handleResponse<Attempt>);
}