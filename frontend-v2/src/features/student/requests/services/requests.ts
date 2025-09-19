import { API_BASE } from '@/constants/env';
import type { RetakeRequest, TeacherPayload } from '../types/request';

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text();
        alert(text);
        throw new Error(`${res.status} — ${text}`);
    }
    return res.json();
}


export const getStudentRetakeRequests = async (): Promise<RetakeRequest[]> => {
    return fetch(`${API_BASE}/api/retake-requests`, {
        credentials: "include",
    }).then(
        handleResponse<RetakeRequest[]>
    );
};

export function updateRequestNotes(id: number, notes: string) {
    return fetch(`${API_BASE}/api/retake-requests/update/notes/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
    }).then(handleResponse<void>);
}

export const searchTeachers = async (emailQuery: string): Promise<TeacherPayload[]> => {
    const url = new URL(`${API_BASE}/api/user/search`);
    if (emailQuery && emailQuery.trim() !== "") url.searchParams.set("emailQuery", emailQuery.trim());
    return fetch(url.toString(), { credentials: "include" }).then(
        handleResponse<TeacherPayload[]>
    );
};

export const createRetakeRequest = async (teacherId: number, requestNotes: string) => {
    return fetch(`${API_BASE}/api/retake-requests`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId, requestNotes }),
    }).then(handleResponse<Request>);
};

