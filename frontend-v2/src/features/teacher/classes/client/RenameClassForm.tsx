import { useState, FormEvent } from 'react';

interface RenameClassFormProps {
    initialName: string;
    onRename: (newName: string) => Promise<void> | void;
}

export function RenameClassForm({ initialName, onRename }: RenameClassFormProps) {
    const [name, setName] = useState(initialName);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!name.trim()) {
            setError('Name cannot be empty.');
            return;
        }
        setError(null);
        setSubmitting(true);
        try {
            await onRename(name.trim());
        } catch {
            setError('Failed to rename.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[250px]">
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xs">
                <h2 className="text-xl font-semibold text-center">Rename Class</h2>

                {error && <p className="text-red-600 text-center">{error}</p>}

                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Class name"
                    required
                    disabled={submitting}
                    className="w-full border px-3 py-2 rounded"
                />

                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition w-full disabled:opacity-50 cursor-pointer"
                >
                    {submitting ? 'Renaming...' : 'Rename'}
                </button>
            </form>
        </div>
      );
}
