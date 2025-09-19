import React, { useState, FormEvent } from 'react';

export interface CreateAssignmentFormProps {
    onCreate: (data: { title: string; description: string; type: 'test' | 'relearning' }) => Promise<void>;
}

export default function CreateAssignmentForm({ onCreate }: CreateAssignmentFormProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'test' | 'relearning'>('test');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await onCreate({ title, description, type });
            setTitle('');
            setDescription('');
            setType('test');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 space-y-6">
            {/* Type selector */}
            <div className="flex space-x-2">
                {(['test', 'relearning'] as const).map((opt) => {
                    const isActive = type === opt;
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setType(opt)}
                            className={`
                flex-1 py-2 rounded 
                ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'} 
                focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer
              `}
                        >
                            {opt === 'test' ? 'Test' : 'Relearning'}
                        </button>
                    );
                })}
            </div>

            {/* Title */}
            <div>
                <label htmlFor="new-assignment-title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    id="new-assignment-title"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter assignment title"
                    required
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="new-assignment-description" className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id="new-assignment-description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded p-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Enter a brief description"
                />
            </div>

            {/* Error */}
            {error && <p className="text-red-600 text-sm">Error: {error}</p>}

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 w-full cursor-pointer"
                    disabled={submitting}
                >
                    {submitting ? 'Creating...' : 'Create'}
                </button>
            </div>
        </form>
    );
}
