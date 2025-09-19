import React, { useState } from "react";
import { Answer } from "../services/attemptService";
import {
    applyCorrectStatusToQuestion,
} from "../services/attemptService";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { FeedbackModal } from "./FeedbackModal";

export const QuestionCard: React.FC<{
    requestId: number;
    answer: Answer;
    onAnswerChange?: (updatedAnswer: Answer) => void;
}> = ({ requestId, answer, onAnswerChange }) => {
    const { question, answerText, feedback: initialFeedback = "", id: answerId } = answer;
    const [currentFeedback, setCurrentFeedback] = useState(initialFeedback);
    const [status, setStatus] = useState<"none" | "correct" | "incorrect">(
        answer?.isCorrect == null ? "none" : answer.isCorrect ? "correct" : "incorrect"
    );
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    const handleStatus = async (newStatus: "correct" | "incorrect") => {
        setMenuOpen(false);
        setStatus(newStatus);
        try {
            await applyCorrectStatusToQuestion(
                requestId,
                answerId,
                newStatus === "correct"
            );
            setModalOpen(false);
            // Notify parent of change
            if (onAnswerChange) {
                onAnswerChange({ ...answer, isCorrect: newStatus === "correct" });
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <>
            <motion.div
                layout
                onClick={() => setModalOpen(true)}
                className="relative rounded-xl border border-gray-200 shadow-sm transition-transform hover:scale-[1.01] duration-150 bg-white mx-6 mb-4 cursor-pointer"
            >
                <div className="flex justify-between items-center px-5 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Question {question.sequence}
                        </h2>
                        <p
                            className="text-xs text-gray-400 truncate"
                            title={question.questionText}
                        >
                            {question.questionText}
                        </p>
                    </div>

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setMenuOpen(!menuOpen);
                            }}
                            className="p-1 rounded-full focus:outline-none"
                        >
                            {status === "correct" ? (
                                <CheckCircleIcon className="h-6 w-6 text-green-500" />
                            ) : status === "incorrect" ? (
                                <XCircleIcon className="h-6 w-6 text-red-500" />
                            ) : (
                                <div className="h-6 w-6 border rounded-full border-gray-300" />
                            )}
                        </button>

                        {menuOpen && (
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white border border-gray-200 rounded-full p-1 shadow-lg z-10">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatus("correct");
                                    }}
                                    className="p-2 rounded-full cursor-pointer hover:bg-green-100 focus:outline-none"
                                >
                                    <CheckCircleIcon className="h-5 w-5 text-green-600" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStatus("incorrect");
                                    }}
                                    className="p-2 rounded-full cursor-pointer hover:bg-red-100 focus:outline-none"
                                >
                                    <XCircleIcon className="h-5 w-5 text-red-600" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="px-5 pb-4">
                    <p className="pl-4 text-gray-700 truncate">{answerText}</p>
                </div>
            </motion.div>

            {modalOpen && (
                <FeedbackModal
                    requestId={requestId}
                    answerId={answerId}
                    questionText={question.questionText}
                    answerKey={question.answerKey}
                    studentAnswer={answerText}
                    initialFeedback={currentFeedback || ""}
                    onFeedbackChange={setCurrentFeedback}
                    onStatusChange={handleStatus}
                    onClose={() => setModalOpen(false)}
                />
            )}
        </>
    );
};
