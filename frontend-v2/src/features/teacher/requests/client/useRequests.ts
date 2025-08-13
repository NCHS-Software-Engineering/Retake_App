import { useState, useCallback } from "react";
import * as svc from "../services/requests";
import type {
    Request,
    SubmissionAttemptPayload,
} from "../types/request";

export default function useRequests() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<"all" | Request["status"]>("all");
    const [openId, setOpenId] = useState<number | null>(null);
    const [submissions, setSubmissions] = useState<Record<number, SubmissionAttemptPayload[]>>({});
    const [editedNotes, setEditedNotes] = useState<Record<number, string>>({});

    const changeFilter = (status: "all" | Request["status"]) => {
        setStatusFilter(status);
    };

    const resolve = async (id: number) => {
        await svc.resolveRequest(id);
        setRequests(r => r.map(x => x.id === id ? { ...x, status: "resolved" } : x));
    };

    const deleteRequest = async (id: number) => {
        await svc.deleteRequest(id);
        setRequests(r => r.filter(x => x.id !== id));
    }

    const create = async (studentId: number, assignmentId: number, notes: string) => {
        const newReq = await svc.createRequest({ studentId: studentId, assignmentId: assignmentId, requestNotes: notes });
        setRequests(r => [newReq, ...r]);
    };

    const updateRequest = async (id: number, notes: string) => {
        await svc.updateRequestNotes(id, notes);
    };

    const loadSubmissions = useCallback(async (id: number) => {
        if (openId === id && !submissions[id]) {
            const data = await svc.getSubmissionAttempts(id);
            setSubmissions(s => ({ ...s, [id]: data }));
        }
    }, [openId, submissions]);

    return {
        requests,
        setRequests,
        loading,
        setLoading,
        statusFilter,
        changeFilter,
        resolve,
        deleteRequest,
        create,
        updateRequest,
        openId,
        setOpenId,
        submissions,
        loadSubmissions,
        editedNotes,
        setEditedNotes
    };
}
