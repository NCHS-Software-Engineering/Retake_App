import {API_BASE} from "@/constants/env";

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const text = await res.text();
        alert(text);
        throw new Error(`${res.status} — ${text}`);
    }
    return res.json();
}

export async function updateAnswer(requestId: number, attemptId: number, answerId: number, answerText: string) {
    return fetch(`${API_BASE}/api/retake-requests/${requestId}/attempts/${attemptId}/answer/${answerId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ answerText }),
        credentials: "include"
    }).then(handleResponse<boolean>);
}

export async function submitAttempt(requestId: number, attemptId: number) {
    return fetch(`${API_BASE}/api/retake-requests/${requestId}/attempts/${attemptId}/submit`, {
        method: "POST",
        credentials: "include"
    }).then(handleResponse<boolean>);
}