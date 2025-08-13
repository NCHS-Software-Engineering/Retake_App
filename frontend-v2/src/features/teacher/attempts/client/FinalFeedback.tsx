// src/components/FinalFeedback.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    setFinalFeedback,
    updateAttemptToGraded,
} from "../services/attemptService";

interface FinalFeedbackProps {
    requestId: number;
    attemptId: number;
    initialFeedback?: string;
}

export function FinalFeedback({
    requestId,
    attemptId,
    initialFeedback = "",
}: FinalFeedbackProps) {
    const [feedback, setFeedback] = useState(initialFeedback);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const handleFinalize = async () => {
        setSaving(true);
        try {
            // Save the final feedback text
            await setFinalFeedback(requestId, attemptId, feedback.trim());
            // Mark attempt as graded
            await updateAttemptToGraded(requestId, attemptId);
            // Redirect back to teacher’s request dashboard
            router.push("/dashboard/teacher/requests");
        } catch (e) {
            console.error("Finalize error:", e);
            setSaving(false);
        }
    };

    return (
        <div className="mx-6 mt-8 p-6 rounded-xl border border-gray-200 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Final Feedback
            </h3>

            <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Add any overall comments for the student (optional)..."
                className="w-full resize-none h-28 p-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />

            <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    You can come back and still edit this.
                </p>
                <button
                    onClick={handleFinalize}
                    disabled={saving}
                    className={`px-4 py-2 rounded-md font-medium transition ${saving
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                >
                    {saving ? "Finalizing…" : "Finalize Grade"}
                </button>
            </div>
        </div>
    );
}
