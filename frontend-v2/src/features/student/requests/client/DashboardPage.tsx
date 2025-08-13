'use client';
import React, { useState, ChangeEvent } from 'react';
import { StudentRequestCard } from './RequestCard';
import { AddRequestModal } from './AddRequestForm';
import { useStudentRequests } from './useStudentRequests';
import { updateRequestNotes } from "../services/requests";
import { deleteRequest } from '@/features/teacher/requests/services/requests';

export default function StudentDashboard() {
    const [sortDesc, setSortDesc] = useState(true);
    const [openId, setOpenId] = useState<number | null>(null);
    const [editedNotes, setEditedNotes] =
        useState<Record<number, string>>({});
    const { requests, loading, refetch } =
        useStudentRequests(sortDesc);

    const save = (id: number) => {
        /* API call to save notes */
        updateRequestNotes(id, editedNotes[id])
        refetch();
    };

    const onDelete =  async (id: number) => {
        await deleteRequest(id);
        refetch();
    }

    return (
        <div className="pt-24 px-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-10 px-50">
                <h1 className="text-4xl font-bold">Your Requests:</h1>
                <div className="flex space-x-2 border-b border-gray-200">
                    <button
                        onClick={() => setSortDesc((d) => !d)}
                        className='px-3 py-1 border rounded hover:bg-gray-100 transition cursor-pointer'
                    >
                        Sort: {sortDesc ? 'Newest' : 'Oldest'}
                    </button>
                    <button
                        onClick={() => setOpenId(-1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
                    >
                        Apply for Retake
                    </button>
                </div>
            </div>

            {/* List & Loading */}
            <div className="space-y-4 w-full mx-auto px-50">
                {loading ? (
                    <p className="text-center text-gray-500 py-12">Loading…</p>
                ) : requests.length === 0 ? (
                    <p className="text-center text-gray-500 py-12">No requests found.</p>
                ) : (
                    requests.map((req) => {
                        const note = editedNotes[req.id] ?? (req.requestNotes || "");
                        return (
                            <StudentRequestCard
                                key={req.id}
                                request={req}
                                currentNotes={note}
                                currentOpenId={openId}
                                onExpand={() =>
                                    setOpenId(openId === req.id ? null : req.id)
                                }
                                onEditNotes={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                    setEditedNotes((prev) => ({
                                        ...prev,
                                        [req.id]: e.target.value,
                                    }))
                                }
                                onDelete={() => onDelete(req.id)}
                                onSave={() => save(req.id)}
                            />
                        );
                    })
                )}
            </div>

            {/* Modal */}
            <AddRequestModal isOpen={openId === -1} onClose={() => setOpenId(null)} refetch={() => refetch()} />
        </div>
    );
}