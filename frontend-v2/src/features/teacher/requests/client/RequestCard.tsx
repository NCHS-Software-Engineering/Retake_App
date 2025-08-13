"use client";

import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";

import type { Request, SubmissionAttemptPayload, ClassData } from "../types/request";
import { STATUS_COLOR, STATUS_LABELS } from "./statusConstants";
import { updateRetakeAssignment } from "../services/requests";
import { Modal } from "@/shared/ui/Modal";

import { deleteSubmission } from "../services/requests";

interface RequestCardProps {
    request: Request;
    requestSubmissions: SubmissionAttemptPayload[];
    currentNotes: string;
    currentOpenId: number | null;
    onExpand: () => void;
    onResolve: () => void;
    onDelete: () => void;
    onEditNotes: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onSave: () => void;
    classesData: ClassData[];
}

export const RequestCard: FC<RequestCardProps> = ({
    request,
    requestSubmissions,
    currentNotes,
    currentOpenId,
    onExpand,
    onResolve,
    onDelete,
    onEditNotes,
    onSave,
    classesData,
}) => {
    const isOpen = currentOpenId === request.id;
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<number | "">("");
    const [selectedSection, setSelectedSection] = useState<number | "">("");
    const [selectedAssignment, setSelectedAssignment] = useState<number | "">("");
    const [updating, setUpdating] = useState(false);
    const [subs, setSubs] = useState<SubmissionAttemptPayload[]>(requestSubmissions);

    const sections = classesData.find(c => c.id === selectedClass)?.sections || [];
    const assignments = sections.find(s => s.id === selectedSection)?.assignments || [];

    useEffect(() => {
        setSubs(requestSubmissions);
    }, [requestSubmissions]);

    // reset modal state when opening
    const openModal = () => {
        setSelectedClass("");
        setSelectedSection("");
        setSelectedAssignment("");
        setModalOpen(true);
    };

    const handleConfirm = async () => {
        if (!selectedAssignment) return;
        setUpdating(true);
        try {
            await updateRetakeAssignment(request.id, Number(selectedAssignment), request.studentId);
            setModalOpen(false);
            // optionally refresh parent
            request.status = "assigned";
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const onDeleteSubmission = async (submissionId: number) => {
        try {
            await deleteSubmission(submissionId);
            setSubs(prev => prev.filter(s => s.id !== submissionId));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className="rounded-xl border border-gray-200 bg-white transition-transform duration-200 hover:shadow-md hover:scale-[1.01] overflow-hidden">
                <div
                    className="flex items-center px-5 py-4 cursor-pointer"
                    onClick={onExpand}
                >
                    <span
                        className={clsx(
                            STATUS_COLOR[request.status],
                            "px-2 py-1 rounded-full text-sm flex-shrink-0 min-w-[120px] flex justify-center items-center text-center"
                        )}
                    >
                        {STATUS_LABELS[request.status]}
                    </span>

                    <div className="flex-1 min-w-0 px-4 truncate text-gray-900">
                        {request.assignment?.title ?? <em className="text-gray-400">No assignment</em>}
                    </div>
                    <div className="flex-1 min-w-0 px-4 truncate text-gray-500">
                        {request.student?.email ?? <em className="text-gray-400">No student</em>}
                    </div>
                    <div className="flex-1 min-w-0 px-4 truncate text-gray-600">
                        {request.requestNotes}
                    </div>

                    {request.status !== "resolved" && (
                        <button
                            type="button"
                            onClick={e => { e.stopPropagation(); onResolve(); }}
                            className="ml-4 p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition cursor-pointer"
                            aria-label="Resolve request"
                        >
                            <CheckIcon className="h-5 w-5" />
                        </button>
                    )}

                    {request.status === "resolved" && (
                        <button
                            type="button"
                            onClick={e => { e.stopPropagation(); onDelete(); }}
                            className="ml-4 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition cursor-pointer"
                            aria-label="Resolve request"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    )}

                </div>

                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="bg-white"
                        >
                            <div className="grid grid-cols-3 gap-4 p-6">
                                <div className="col-span-2 flex flex-col">
                                    <label className="text-xs font-semibold mb-1 text-gray-700">Notes</label>
                                    <textarea
                                        value={currentNotes}
                                        onChange={onEditNotes}
                                        placeholder="Request notes…"
                                        className="flex-1 p-2 text-sm border rounded resize-none focus:ring-1 focus:ring-blue-400 outline-none"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label htmlFor={`assign-${request.id}`} className="text-xs font-semibold mb-1 text-gray-700">
                                        Assignment ID
                                    </label>
                                    <input
                                        id={`assign-${request.id}`}
                                        type="number"
                                        min={1}
                                        value={request.assignmentId}
                                        readOnly
                                        className="p-2 text-sm border rounded focus:ring-1 focus:ring-blue-400 outline-none"
                                    />
                                    <button
                                        className="p-2 mt-2 text-xs border py-1 rounded hover:underline hover:bg-gray-300 cursor-pointer"
                                        onClick={openModal}
                                    >
                                        Manually Choose Assignment
                                    </button>
                                </div>

                            </div>

                            <div className="px-6 pb-6">
                                <h3 className="text-sm font-semibold text-gray-800 mb-2">Submissions</h3>
                                {subs.length === 0 ? (
                                    <p className="text-xs text-gray-500">No submissions found.</p>
                                ) : (
                                    <div className="flex space-x-3 overflow-x-auto">
                                        {subs.map(s => (
                                            <div className="relative group flex-shrink-0 w-40 h-32 bg-white border border-gray-300 rounded-lg p-3 overflow-visible" key={s.id}>
                                                <a
                                                    href={`/dashboard/teacher/requests/${request.id}/attempt/${s.id}`}
                                                    className="block h-full text-xs text-gray-800 space-y-1"
                                                >
                                                    <p className="font-semibold truncate">ID: {s.id}</p>
                                                    <p className="truncate">{new Date(s.submittedAt).toLocaleString()}</p>
                                                    <p>
                                                        <strong>Score:</strong>{' '}
                                                        {s.score != null ? s.score : <em className="text-gray-400">Unscored</em>}
                                                    </p>
                                                    <p className="truncate">
                                                        <strong>Feedback:</strong>{' '}
                                                        {s.feedback?.trim() ? s.feedback : <em className="text-gray-400">None</em>}
                                                    </p>
                                                </a>

                                                <button
                                                    onClick={() => onDeleteSubmission(s.id)}
                                                    className={`
                                                    absolute bottom-0 left-0 w-full h-8
                                                    bg-red-500 text-white text-center text-sm
                                                    flex items-center justify-center space-x-1
                                                    rounded-b-lg
                                                    overflow-visible
                                                    transform translate-y-full
                                                    transition-transform duration-150
                                                    group-hover:translate-y-0
                                                    z-10
                                                    cursor-pointer
                                                    hover:bg-red-700
                                                  `}
                                                >
                                                    <span>Delete</span>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end px-6 pb-6">
                                <motion.button
                                    type="button"
                                    onClick={onSave}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 text-sm font-medium rounded-full bg-blue-600 text-white shadow-md cursor-pointer hover:bg-blue-700"
                                >Save</motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Assignment Modal */}
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="p-6 w-96">
                    <h2 className="text-xl font-bold mb-4 text-center">Reassign Request</h2>
                    <div className="space-y-4">
                        <select
                            className="w-full p-3 border rounded-lg"
                            value={selectedClass}
                            onChange={e => { setSelectedClass(Number(e.target.value)); setSelectedSection(""); setSelectedAssignment(""); }}
                        >
                            <option value="">Select Class</option>
                            {classesData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>

                        <select
                            className="w-full p-3 border rounded-lg"
                            value={selectedSection}
                            onChange={e => { setSelectedSection(Number(e.target.value)); setSelectedAssignment(""); }}
                            disabled={!selectedClass}
                        >
                            <option value="">Select Section</option>
                            {sections.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>

                        <select
                            className="w-full p-3 border rounded-lg"
                            value={selectedAssignment}
                            onChange={e => setSelectedAssignment(Number(e.target.value))}
                            disabled={!selectedSection}
                        >
                            <option value="">Select Assignment</option>
                            {assignments.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                        </select>

                        <div className="flex justify-center">
                            <button
                                onClick={handleConfirm}
                                disabled={!selectedAssignment || updating}
                                className="w-full px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
                            >
                                {updating ? 'Updating...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}