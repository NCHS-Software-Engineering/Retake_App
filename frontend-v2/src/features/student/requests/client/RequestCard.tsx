'use client';
import React, { FC, ChangeEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import type { RetakeRequest } from '../types/request';
import { STATUS_LABELS, STATUS_COLOR } from './statusConstants';
import { API_BASE } from '@/constants/env';

interface Props {
    request: RetakeRequest;
    currentNotes: string;
    currentOpenId: number | null;
    onExpand: () => void;
    onEditNotes: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    onDelete: () => void;
    onSave: () => void;
}

export const StudentRequestCard: FC<Props> = ({ request, currentNotes, currentOpenId, onExpand, onEditNotes, onDelete, onSave }) => {
        const isOpen = currentOpenId === request.id;
        const router = useRouter();

        const handleRetakeClick = async () => {
            // router.push(
            //     `/dashboard/student/requests/${request.id}/take`
            // )
            try {
                const res = await fetch(
                    `${API_BASE}/api/retake-requests/${request.id}/attempts`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }
                );

                if (!res.ok) throw new Error("Failed to create request attempt");

                const data = await res.json();

                if (typeof data.id === "number" && data.id > 0) {
                    router.push(
                        `/dashboard/student/requests/${request.id}/take/${data.id}`
                    );
                } else {
                    console.log(data);
                    throw new Error("Invalid attempt ID received");
                }
            } catch (err) {
                console.error(err);
                router.push("/dashboard/student");
            }

        }

        return (
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden transition-shadow hover:shadow-md">
                <div
                    className="flex items-center px-5 py-4 cursor-pointer"
                    onClick={onExpand}
                >
                    <span
                        className={clsx(
                            STATUS_COLOR[request.status],
                            'w-[120px] text-center px-2 py-1 rounded-full text-sm flex-shrink-0'
                        )}
                    >
                        {STATUS_LABELS[request.status]}
                    </span>
                    <div className="flex-1 px-4 truncate font-semibold text-gray-900">
                        {request.assignment?.title || 'No Assignment'}
                    </div>
                    <div className="flex-1 px-4 truncate text-gray-500">
                        {request.teacher.email}
                    </div>
                    <div className="flex-1 px-4 truncate text-gray-600">
                        {currentNotes}
                    </div>


                    {request.status === "pending" || request.status === "resolved" && (
                        <button
                            type="button"
                            onClick={e => { e.stopPropagation(); onDelete(); }}
                            className="ml-4 p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
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
                            <div className="p-6">
                                <label className="text-xs font-semibold mb-1 text-gray-700 block">
                                    Notes
                                </label>
                                <textarea
                                    value={currentNotes}
                                    onChange={onEditNotes}
                                    placeholder="Request notes…"
                                    className="w-full p-3 text-sm border rounded resize-none focus:ring-1 focus:ring-blue-400 outline-none"
                                />
                            </div>

                            {request.status !== "pending" && request.status !== "resolved" && (
                                <div className="px-6 pb-6">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-2">
                                        Submissions
                                    </h3>
                                    <div className="flex space-x-3 overflow-x-auto">
                                        <motion.button
                                            onClick={handleRetakeClick}
                                            className="flex-shrink-0 w-40 h-32 border-2 border-blue-400 rounded-lg flex items-center justify-center text-blue-600 cursor-pointer"
                                        >
                                            <PlusIcon className="h-8 w-8" />
                                        </motion.button>

                                        {request.attempts.map((a) => (


                                            <div className="relative group flex-shrink-0 w-40 h-32 bg-white border border-gray-300 rounded-lg p-3 overflow-visible" key={a.id}>
                                                <a
                                                    href={`/dashboard/student/requests/${request.id}/take/${a.id}`}
                                                    className="block h-full text-xs text-gray-800 space-y-1"
                                                >
                                                    <p className="font-semibold truncate">ID: {a.id}</p>
                                                    <p className="truncate">{new Date(a.submittedAt).toLocaleString()}</p>
                                                    <p>
                                                        <strong>Score:</strong>{' '}
                                                        {a.score != null ? a.score : <em className="text-gray-400">Unscored</em>}
                                                    </p>
                                                    <p className="truncate">
                                                        <strong>Feedback:</strong>{' '}
                                                        {a.feedback?.trim() ? a.feedback : <em className="text-gray-400">None</em>}
                                                    </p>
                                                </a>
                                            </div>

                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end px-6 pb-6">
                                <motion.button
                                    type="button"
                                    onClick={onSave}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 text-sm font-medium rounded-full bg-blue-600 text-white shadow-md"
                                >
                                    Save
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };