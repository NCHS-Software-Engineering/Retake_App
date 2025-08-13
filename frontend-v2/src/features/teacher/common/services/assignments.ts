import { AssignmentPayload, QuestionPayload } from "@/features/teacher/common/types/sections";

import { API_BASE } from "@/constants/env";

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status} – ${text}`);
    }
    return res.json();
}

export async function getAssignment(
    classId: number,
    sectionId: number,
    assignmentId: number
): Promise<AssignmentPayload> {
    const res = await fetch(
        `${API_BASE}/api/classes/${classId}/sections/${sectionId}/assignments/${assignmentId}`,
        { credentials: "include" }
    );
    return handleResponse(res);
}

export async function createAssignment(
    classId: number,
    sectionId: number,
    payload: {
        type: string;
        title: string;
        description?: string;
        questions?: QuestionPayload[];
    }
): Promise<AssignmentPayload> {
    const res = await fetch(
        `${API_BASE}/api/classes/${classId}/sections/${sectionId}/assignments`,
        {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }
    );
    return handleResponse(res);
}

export async function editAssignment(
    classId: number,
    sectionId: number,
    assignmentId: number,
    payload: {
        title: string;
        description?: string;
        questions: QuestionPayload[];
    }
): Promise<AssignmentPayload> {
    const res = await fetch(
        `${API_BASE}/api/classes/${classId}/sections/${sectionId}/assignments/${assignmentId}`,
        {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }
    );
    return handleResponse(res);
}

export async function deleteAssignment(
    classId: number,
    sectionId: number,
    assignmentId: number
): Promise<void> {
    const res = await fetch(
        `${API_BASE}/api/classes/${classId}/sections/${sectionId}/assignments/${assignmentId}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );
    if (!res.ok) throw new Error(`Failed to delete: ${res.status}`);
}

export async function createQuestion(
    classId: number,
    sectionId: number,
    assignmentId: number,
    payload: { question: string; answer: string }
): Promise<QuestionPayload> {
    const res = await fetch(
        `${API_BASE}/api/classes/${classId}/sections/${sectionId}/assignments/${assignmentId}/questions`,
        {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }
    );
    return handleResponse<QuestionPayload>(res);
}

export async function updateQuestion(
    classId: number,
    sectionId: number,
    assignmentId: number,
    questionId: number,
    payload: { question: string; answer: string }
): Promise<QuestionPayload> {
    const res = await fetch(
        `${API_BASE}/api/classes/${classId}/sections/${sectionId}/assignments/${assignmentId}/questions/${questionId}`,
        {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        }
    );
    return handleResponse<QuestionPayload>(res);
}

export async function deleteQuestion(
    classId: number,
    sectionId: number,
    assignmentId: number,
    questionId: number
): Promise<void> {
    const res = await fetch(
        `${API_BASE}/api/classes/${classId}/sections/${sectionId}/assignments/${assignmentId}/questions/${questionId}`,
        {
            method: "DELETE",
            credentials: "include",
        }
    );
    if (!res.ok) throw new Error(`Failed to delete question: ${res.status}`);
}

export async function reorderQuestions(
    classId: number,
    sectionId: number,
    assignmentId: number,
    questionIds: number[]
): Promise<QuestionPayload[]> {
    console.log(questionIds)
    const res = await fetch(
        `${API_BASE}/api/classes/${classId}/sections/${sectionId}/assignments/${assignmentId}/questions/`,
        {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questionIds }),
        }
    );
    return handleResponse<QuestionPayload[]>(res);
}

