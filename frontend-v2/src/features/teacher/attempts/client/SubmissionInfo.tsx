import React from "react";

export const SubmissionInfo: React.FC<{ submittedAt: string; score: number | null; }> = ({ submittedAt, score }) => (
    <div className="bg-gray-100 p-4 rounded-lg mx-6 flex flex-col sm:flex-row sm:justify-between">
        <div>
            <p className="text-sm text-gray-600">Submitted:</p>
            <p className="font-medium">{new Date(submittedAt).toLocaleString()}</p>
        </div>
        <div className="mt-4 sm:mt-0">
            <p className="text-sm text-gray-600">Score:</p>
            <p className="font-medium">{score !== null ? `${score}%` : "N/A"}</p>
        </div>
    </div>
);