'use client';

import {
    PencilIcon,
    TrashIcon,
    ChevronDownIcon,
    ChevronRightIcon,
} from '@heroicons/react/24/outline';
import type { Section, Assignment } from "@/features/teacher/common/types/sections";
import { useState } from 'react';
import clsx from 'clsx';

interface Props {
    sections: Section[];
    onSelect: (id: number) => void;
    onRename: (id: number, currentName: string) => void;
    onDelete: (id: number) => void;
    onSelectAssignment?: (id: number) => void;
}

export function SectionsGrid({
    sections,
    onSelect,
    onRename,
    onDelete,
    onSelectAssignment,
}: Props) {
    const [openSectionId, setOpenSectionId] = useState<number | null>(null);

    const toggleSection = (id: number) => {
        setOpenSectionId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="grid grid-cols-1 gap-6 mb-8">
            {sections.map((section) => {
                const isOpen = openSectionId === section.id;
                return (
                    <div
                        key={section.id}
                        className="rounded-xl border border-gray-200 shadow-sm transition-transform hover:scale-[1.01] duration-150 bg-white"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center px-5 py-4 group">
                            {/* Left: chevron + title */}
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => toggleSection(section.id)}
                                    aria-label={isOpen ? 'Collapse' : 'Expand'}
                                    className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                                >
                                    {isOpen ? (
                                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                                    ) : (
                                        <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                                    )}
                                </button>

                                <div onClick={() => onSelect(section.id)} className="cursor-pointer">
                                    <h2 className="text-lg font-semibold text-gray-800">{section.name}</h2>
                                    <p className="text-xs text-gray-400">ID: {section.id}</p>
                                </div>
                            </div>

                            {/* Edit/Delete */}
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRename(section.id, section.name);
                                    }}
                                    className="p-1 hover:bg-yellow-100 rounded"
                                >
                                    <PencilIcon className="h-5 w-5 text-yellow-600 cursor-pointer" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(section.id);
                                    }}
                                    className="p-1 hover:bg-red-100 rounded"
                                >
                                    <TrashIcon className="h-5 w-5 text-red-500 cursor-pointer" />
                                </button>
                            </div>
                        </div>

                        {/* Assignments */}
                        <div
                            className={clsx(
                                'overflow-hidden transition-all duration-300 px-5',
                                isOpen ? 'max-h-[1000px] py-4' : 'max-h-0'
                            )}
                        >
                            <div className="flex flex-col gap-6">
                                {(['test', 'relearning'] as Assignment['type'][]).map((type) => (
                                    <div key={type}>
                                        <h3
                                            className={clsx(
                                                'text-sm font-semibold mb-2 uppercase tracking-wide',
                                                type === 'test' ? 'text-blue-600' : 'text-green-600'
                                            )}
                                        >
                                            {type === 'test' ? 'Tests' : 'Relearning Work'}
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {section.assignments
                                                .filter((a) => a.type === type)
                                                .map((a) => (
                                                    <div
                                                        key={a.id}
                                                        onClick={() => onSelectAssignment?.(a.id)}
                                                        className={clsx(
                                                            'relative p-4 rounded-lg border cursor-pointer',
                                                            'transition-transform transition-shadow duration-200 ease-out',
                                                            type === 'test'
                                                                ? 'bg-blue-50 hover:bg-blue-100 hover:shadow-lg hover:scale-[1.02]'
                                                                : 'bg-green-50 hover:bg-green-100 hover:shadow-lg hover:scale-[1.02]'
                                                        )}
                                                    >
                                                        <h4 className="font-medium truncate">{a.title}</h4>
                                                        <p className="text-xs text-gray-500 truncate">ID: {a.id}</p>
                                                        <p className="mt-1 text-sm text-gray-600 truncate">
                                                            {a.description}
                                                        </p>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
