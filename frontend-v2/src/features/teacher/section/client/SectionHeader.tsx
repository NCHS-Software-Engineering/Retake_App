import { PencilIcon, TrashIcon, DocumentPlusIcon } from "@heroicons/react/24/outline";

// Header component
interface SectionHeaderProps {
    name: string;
    onRename: () => void;
    onDelete: () => void;
    onCreateAssignment?: () => void; // Optional handler for plus button
}
export default function SectionHeader({ name, onRename, onDelete, onCreateAssignment }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold truncate">{name}</h1>
            <div className="flex space-x-2 border-b border-gray-200">
                <button
                    type="button"
                    aria-label="Create Assignment"
                    onClick={onCreateAssignment}
                    className="p-1 hover:bg-green-100 rounded"
                >
                    <DocumentPlusIcon className="h-5 w-5 text-green-600 cursor-pointer" />
                </button>
                <button
                    type="button"
                    aria-label="Edit Section"
                    onClick={onRename}
                    className="p-1 hover:bg-yellow-100 rounded cursor-pointer" 
                >
                    <PencilIcon className="h-5 w-5 text-yellow-600 cursor-pointer" />
                </button>
                <button
                    type="button"
                    aria-label="Delete Section"
                    onClick={onDelete}
                    className="p-1 hover:bg-red-100 rounded"
                >
                    <TrashIcon className="h-5 w-5 text-red-600 cursor-pointer" />
                </button>
            </div>
        </div>
    );
}