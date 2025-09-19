import React, { useState } from 'react';

// Props for deleting an assignment
interface DeleteAssignmentFormProps {
    assignmentTitle: string;
    onDelete: () => Promise<void>;
}

export default function DeleteAssignmentForm({ assignmentTitle, onDelete }: DeleteAssignmentFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        setSubmitting(true);
        setError(null);
        try {
            await onDelete();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-gray-800">
                Are you sure you want to delete the assignment <strong>{assignmentTitle}</strong>?
            </p>
            {error && <p className="text-red-600 text-sm">Error: {error}</p>}
            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={() => setSubmitting(false)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    disabled={submitting}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleConfirm}
                    className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                    disabled={submitting}
                >
                    {submitting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    );
}
