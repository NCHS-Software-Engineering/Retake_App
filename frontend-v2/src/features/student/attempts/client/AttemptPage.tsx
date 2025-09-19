"use client";

import { useParams } from "next/navigation";
import useAttempts from "./useAttempts";
import QuestionCard from "./QuestionCard";
import { motion } from "framer-motion";

export default function AttemptPage() {
    const { takeId, requestId } = useParams();
    const reqId = Number(requestId);
    const tId = Number(takeId);
    const { attempt, questions, loading, error, handleChange, handleSubmit } =
        useAttempts(reqId, tId);
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
            <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-semibold mb-6"
            >
                Student Retake Form
            </motion.h1>

            {error && (
                <div className="text-red-500 mb-4">Error: {error}</div>
            )}

            {loading ? (
                <div className="text-gray-500">Loading...</div>
            ) : (

                    <div className="w-full max-w-2xl space-y-8">

                        {/* Feedback & Score Container */}
                        <div className="flex flex-col md:flex-row gap-4">
                            {attempt?.feedback && (
                                <div className="flex-1 border border-gray-300 px-4 py-3 rounded">
                                    <h4 className="font-semibold text-base mb-1">Feedback</h4>
                                    <div className="text-sm max-h-15 overflow-y-auto">
                                        {attempt.feedback}
                                    </div>
                                </div>
                            )}

                            {attempt?.score != null && (
                                <div className="flex-1 border border-gray-300 px-4 py-3 rounded flex flex-col justify-center items-start">
                                    <h4 className="font-semibold text-base mb-1">Score</h4>
                                    <p className="text-lg">
                                        {typeof attempt.score === "number"
                                            ? `${attempt.score}%`
                                            : "--"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Questions & Submit */}
                        <div className="space-y-4">
                            {questions.map((q) => (
                                <QuestionCard key={q.id} score={attempt?.score} question={q} onChange={handleChange} />
                            ))}

                            <div className="flex justify-center">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full md:w-auto bg-blue-600 text-white font-medium px-6 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
            )}
        </div>
    );
}
