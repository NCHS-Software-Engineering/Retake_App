'use client';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Assignment } from "@/features/teacher/common/types/sections";

interface AssignmentColumnProps {
    type: Assignment['type'];
    assignments: Assignment[];
    onSelect: (assignmentId: number) => void;
    onEditAssignment: (assignmentId: number) => void;
    onDeleteAssignment: (assignmentId: number) => void;
}

export function AssignmentColumn({
    type,
    assignments,
    onSelect,
    onEditAssignment,
    onDeleteAssignment,
}: AssignmentColumnProps) {
    const title = type === 'test' ? 'Tests' : 'Relearning Work';
    const color = type === 'test' ? 'blue' : 'green';

    return (
        <div className="flex flex-col flex-1 basis-0">
            {/* Header with count badge */}
            <div className="flex items-center justify-between mb-2 px-2">
                <h3 className={`text-lg font-semibold text-${color}-600`}>{title}</h3>
                <span className="text-sm bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                    {assignments.length}
                </span>
            </div>

            {/* Assignment cards */}
            <div className="flex flex-col gap-4">
                {assignments.map((a) => (
                    <div
                        key={a.id}
                        onClick={() => onSelect(a.id)}
                        className={`
              relative p-4 border rounded-xl 
              bg-${color}-50
              hover:shadow-lg hover:scale-[1.02]
              transform transition-all duration-200 ease-out
              cursor-pointer group
            `}
                    >
                        <div className="flex items-start justify-between">
                            <div className="pr-8">
                                <h4 className="font-medium truncate">{a.title}</h4>
                                <p className="text-xs text-gray-500 truncate">ID: {a.id}</p>
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                    {a.description}
                                </p>
                            </div>

                            {/* Edit/Delete icons only on hover */}
                            <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEditAssignment(a.id);
                                    }}
                                    className="p-1 rounded hover:bg-yellow-100"
                                    aria-label="Edit"
                                >
                                    <PencilIcon className="h-5 w-5 text-yellow-600 cursor-pointer" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteAssignment(a.id);
                                    }}
                                    className="p-1 rounded hover:bg-red-100"
                                    aria-label="Delete"
                                >
                                    <TrashIcon className="h-5 w-5 text-red-600 cursor-pointer" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
