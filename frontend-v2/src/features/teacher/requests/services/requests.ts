import { API_BASE } from "@/constants/env";
import {
    type RequestPayload,
    type SubmissionAttemptPayload,
    type NewRequestBody,
    type StudentPayload,
    type Request,
    ClassData
} from "../types/request";

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text();
        alert(text);
        throw new Error(`${res.status} — ${text}`);
    }
    return res.json();
}

export function getRequests(status?: string) {
    const url = new URL(`${API_BASE}/api/retake-requests/`);
    if (status && status !== "all") url.searchParams.set("status", status);
    return fetch(url.toString(), { credentials: "include" })
        .then(handleResponse<RequestPayload[]>);
}

export function getStudentSearchResult(status?: string, emailQuery?: string) {
    const url = new URL(`${API_BASE}/api/retake-requests/search`);
    if (status && status !== "all") url.searchParams.set("status", status);
    if (emailQuery && emailQuery.trim() !== "") url.searchParams.set("emailQuery", emailQuery.trim());
    return fetch(url.toString(), { credentials: "include" }).then(
        handleResponse<RequestPayload[]>
    );
  }

export function resolveRequest(id: number) {
    return fetch(`${API_BASE}/api/retake-requests/${id}`, {
        method: "PATCH",
        credentials: "include",
    }).then(handleResponse<void>);
}

export function deleteRequest(id: number) {
    return fetch(`${API_BASE}/api/retake-requests/${id}`, {
        method: "DELETE",
        credentials: "include",
    }).then(handleResponse<void>);
}

export function createRequest(body: NewRequestBody) {
    return fetch(`${API_BASE}/api/retake-requests`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }).then(handleResponse<Request>);
}

export function updateRequestNotes(id: number, notes: string) {
    return fetch(`${API_BASE}/api/retake-requests/update/notes/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
    }).then(handleResponse<void>);
}

export function updateRetakeAssignment(requestId: number, assignmentId: number, studentId: number) {
    return fetch(`${API_BASE}/api/retake-requests/update/assignment/${requestId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({assignmentId, studentId})
    }).then(
        handleResponse<ClassData[]>
    )
}

export function getSubmissionAttempts(requestId: number) {
    return fetch(`${API_BASE}/api/retake-requests/${requestId}/attempts`, {
        credentials: "include",
    }).then(handleResponse<SubmissionAttemptPayload[]>);
}

export function getSearchStudentUsers(emailQuery: string) {
    const url = new URL(`${API_BASE}/api/user/search`);
    if (emailQuery && emailQuery.trim() !== "") url.searchParams.set("emailQuery", emailQuery.trim());
    return fetch(url.toString(), { credentials: "include" }).then(
        handleResponse<StudentPayload[]>
    );
}

export function getClassesData() {
    return fetch(`${API_BASE}/api/classes/all`, {
        credentials: "include"
    }).then(
        handleResponse<ClassData[]>
    )
}

export function deleteSubmission(submissionId: number) {
    return fetch(`${API_BASE}/api/retake-requests/submissions/${submissionId}`, {
        method: "DELETE",
        credentials: "include"
    }).then(handleResponse<void>);
}