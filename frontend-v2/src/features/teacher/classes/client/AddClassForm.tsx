'use client';
import { FormEvent, useState } from 'react';

interface Props {
    onCreate: (name: string) => Promise<void>;
    onClose: () => void;
}

export function AddClassForm({ onCreate, onClose }: Props) {
    const [name, setName] = useState('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await onCreate(name);
            onClose();
        } catch {
            onClose();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[250px]">
            <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xs">
            <h2 className="text-xl font-semibold text-center">Create New Class</h2>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Class name"
                required
                className="w-full border px-3 py-2 rounded"
            />
            <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full cursor-pointer"
            >
                Create
            </button>
            </form>
        </div>
    );
}