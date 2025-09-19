import React, { useState, FormEvent } from 'react';

// Props for renaming an assignment
interface EditAssignmentFormProps {
    initialTitle: string;
    initialDescription: string;
    onEdit: (data: { title: string; description: string }) => Promise<void>;
}

export default function EditAssignmentForm({ initialTitle, initialDescription, onEdit }: EditAssignmentFormProps) {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            await onEdit({ title, description });
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="assignment-title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    id="assignment-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                    required
                />
            </div>

            <div>
                <label htmlFor="assignment-description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="assignment-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full border rounded p-2"
                    rows={3}
                    required
                />
            </div>

            {error && <p className="text-red-600 text-sm">Error: {error}</p>}

            <div className="flex justify-end space-x-2">
                <button
                    type="submit"
                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition w-full disabled:opacity-50 cursor-pointer"
                    disabled={submitting}
                >
                    {submitting ? 'Editing...' : 'Edit'}
                </button>
            </div>
        </form>
    );
}