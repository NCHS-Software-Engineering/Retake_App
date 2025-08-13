import { useState } from 'react';

interface DeleteClassFormProps {
    className: string;
    onDelete: () => Promise<void> | void;
}

export function DeleteClassForm({ className, onDelete }: DeleteClassFormProps) {
    const [submitting, setSubmitting] = useState(false);

    async function handleDelete() {
        setSubmitting(true);
        try {
            await onDelete();
        } catch (err) {
            console.error('Delete failed', err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[250px]">
            <div className="space-y-4 w-full max-w-xs text-center">
                <h2 className="text-xl font-semibold">Delete Class</h2>
                <p>
                    Are you sure you want to delete <b>{className}</b>? This action cannot be undone.
                </p>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition w-full disabled:opacity-50 cursor-pointer"
                >
                    {submitting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    );
}
