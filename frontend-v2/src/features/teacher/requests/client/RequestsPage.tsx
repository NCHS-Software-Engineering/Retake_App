"use client";

import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import useRequests from "./useRequests";
import { Modal } from "@/shared/ui/Modal";
import AddRequestForm from "./AddRequestForm";
import { FilterTabs } from "./FilterTabs";
import { RequestCard } from "./RequestCard";
import {
    getRequests,
    getStudentSearchResult,
    getClassesData,
} from "../services/requests";
import { StudentSearchBar } from "./StudentSearch";

import type { Request, ClassData } from "../types/request";

export default function RequestsPage() {
    const {
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
        setEditedNotes,
    } = useRequests();

    const [studentQuery, setStudentQuery] = useState("");
    const fetchStudents = useCallback(async () => {
        if (!studentQuery.trim()) return;
        setLoading(true);
        try {
            const results = await getStudentSearchResult(
                statusFilter,
                studentQuery
            );
            setRequests(results);
        } finally {
            setLoading(false);
        }
    }, [statusFilter, studentQuery, setRequests, setLoading]);

    // When the search input is empty refetch all requests
    useEffect(() => {
        if (studentQuery.trim() === "") {
            setLoading(true);
            getRequests(statusFilter)
                .then((all) => setRequests(all))
                .finally(() => setLoading(false));
        }
    }, [studentQuery, statusFilter, setRequests, setLoading]);

    // getRequests and filter diffrent status
    useEffect(() => {
        setLoading(true);
        getRequests(statusFilter)
            .then((all) => setRequests(all))
            .finally(() => setLoading(false));
    }, [statusFilter, setRequests, setLoading]);

    // Load submissions when a card expands
    useEffect(() => {
        if (openId !== null) {
            loadSubmissions(openId);
        }
    }, [openId, loadSubmissions]);

    // Load all class for assignment changes
    const [classesData, setClassesData] = useState<ClassData[]>([]);
    useEffect(() => {
        getClassesData().then(setClassesData).catch(console.error);
    }, []);

    // Modal Handlers
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const handleNewClick = () => setIsCreateOpen(true);
    const handleModalClose = () => setIsCreateOpen(false);
    const handleCreate = async (
        studentId: number,
        assignmentId: number,
        notes: string
    ) => {
        await create(studentId, assignmentId, notes);
        setIsCreateOpen(false);
    };

    const handleFilterChange = (status: "all" | Request["status"]) =>
        changeFilter(status);

    return (
        <div className="p-6 space-y-6 max-w-full overflow-x-hidden">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Retake Requests</h1>
                <button
                    onClick={handleNewClick}
                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:scale-105 transition-transform cursor-pointer"
                >
                    <DocumentPlusIcon className="h-5 w-5" />
                    <span>New Request</span>
                </button>
            </div>

            <div className="flex items-center justify-between">
                <FilterTabs current={statusFilter} onChange={handleFilterChange} />
                <StudentSearchBar
                    query={studentQuery}
                    onChange={setStudentQuery}
                    fetchStudents={fetchStudents}
                    setLoading={setLoading}
                    debounceMs={1500}
                />
            </div>

            {loading ? (
                <p className="text-center text-gray-500 py-12">Loading…</p>
            ) : requests.length === 0 ? (
                <p className="text-center text-gray-500 py-12">No requests found.</p>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => {
                        const note = editedNotes[req.id] ?? req.requestNotes;
                        const subs = submissions[req.id] ?? [];
                        return (
                            <RequestCard
                                key={req.id}
                                request={req}
                                requestSubmissions={subs}
                                currentNotes={note}
                                currentOpenId={openId}
                                onExpand={() =>
                                    setOpenId(openId === req.id ? null : req.id)
                                }
                                onResolve={() => resolve(req.id)}
                                onDelete={() => deleteRequest(req.id)}
                                onEditNotes={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                    setEditedNotes((prev) => ({
                                        ...prev,
                                        [req.id]: e.target.value,
                                    }))
                                }
                                onSave={() => updateRequest(req.id, note)}
                                classesData={classesData}
                            />
                        );
                    })}
                </div>
            )}

            <Modal isOpen={isCreateOpen} onClose={handleModalClose}>
                <AddRequestForm onCreate={handleCreate} />
            </Modal>
        </div>
    );
}
