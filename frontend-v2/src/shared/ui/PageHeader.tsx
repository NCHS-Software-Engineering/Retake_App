'use client';

interface Props {
    title: string;
    buttonName: string;
    onCreateClick: () => void;
}

export function PageHeader({ title, buttonName, onCreateClick }: Props) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            <button
                onClick={onCreateClick}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer"
            >
                {buttonName}
            </button>
        </div>
    );
}