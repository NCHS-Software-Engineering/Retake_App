'use client';
import { useState } from 'react';

interface Props {
    onCreate: (name: string) => Promise<void>;
}

export function AddSectionForm({ onCreate }: Props) {
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) { 
            setError("Name cant be empty");
        return;
        }
        setSubmitting(true);
        try {
            await onCreate(name.trim());
        } catch {
            // optionally show error
            setError("Falied to create section");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[250px]">
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xs">
                <h2 className="text-xl font-semibold text-center">Create New Section</h2>

                {error && <p className="text-red-600 text-center">{error}</p>}

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Section name"
                    required
                    disabled={submitting}
                    className="w-full border px-3 py-2 rounded"
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full disabled:opacity-50 cursor-pointer"
                >
                    {submitting ? 'Creating…' : 'Create'}
                </button>
            </form>
        </div>
      );
}
