"use client";

import React, { useState } from "react";
import { createPortal } from "react-dom";
import { setTeacherFeedbackToQuestion } from "../services/attemptService";
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useDebouncedCallback } from "./useDebouncedCallback";

interface FeedbackModalProps {
    requestId: number;
    answerId: number;
    questionText: string;
    answerKey: string | null;
    studentAnswer: string;
    onStatusChange: (s: "correct" | "incorrect") => void;
    initialFeedback: string;
    onFeedbackChange?: (newText: string) => void;
    onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
    requestId,
    answerId,
    questionText,
    answerKey,
    studentAnswer,
    onStatusChange,
    initialFeedback,
    onFeedbackChange,
    onClose,
}) => {
    const [feedback, setFeedback] = useState(initialFeedback);

    const debouncedSave = useDebouncedCallback(async (text: string) => {
        try {
            await setTeacherFeedbackToQuestion(requestId, answerId, text);
            onFeedbackChange?.(text);
        } catch (e) {
            console.error(e);
        }
    }, 1000);

    const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const txt = e.target.value;
        setFeedback(txt);
        debouncedSave(txt.trim());
    };

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 overflow-hidden"
        >
            <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-gray-200 rounded-xl w-11/12 h-5/6 overflow-auto relative p-6 shadow-lg"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-red-100 focus:outline-none cursor-pointer"
                >
                    <XMarkIcon className="h-6 w-6 text-red-600" />
                </button>

                <div className="divide-y divide-gray-200 space-y-6">
                    <section className="pt-4">
                        <h3 className="text-xl font-semibold mb-2">Question</h3>
                        <p className="text-gray-800 whitespace-pre-wrap">{questionText}</p>
                    </section>

                    <section className="py-4">
                        <h3 className="text-xl font-semibold mb-2">Answer Key</h3>
                        <p className="text-gray-700">{answerKey ?? "N/A"}</p>
                    </section>

                    <section className="py-4">
                        <h3 className="text-xl font-semibold mb-2">Student Answer</h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{studentAnswer}</p>
                    </section>

                    <section className="py-4">
                        <h3 className="text-xl font-semibold mb-2">Your Feedback</h3>
                        <textarea
                            value={feedback}
                            onChange={handleFeedbackChange}
                            placeholder="Teacher feedback..."
                            className="w-full h-32 mt-2 p-3 border border-gray-300 rounded-lg focus:outline-none resize-none"
                        />
                    </section>
                </div>

                <div className="flex justify-center gap-6 mt-6 pb-4">
                    <button
                        onClick={() => onStatusChange("correct")}
                        className="flex-1 flex items-center justify-center px-5 py-2 border border-green-500 rounded-lg cursor-pointer hover:bg-green-50 focus:outline-none transition"
                    >
                        <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                        <span className="font-medium text-green-600">Mark Correct</span>
                    </button>
                    <button
                        onClick={() => onStatusChange("incorrect")}
                        className="flex-1 flex items-center justify-center px-5 py-2 border border-red-500 rounded-lg cursor-pointer hover:bg-red-50 focus:outline-none transition"
                    >
                        <XCircleIcon className="h-6 w-6 text-red-600 mr-2" />
                        <span className="font-medium text-red-600">Mark Incorrect</span>
                    </button>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
};
