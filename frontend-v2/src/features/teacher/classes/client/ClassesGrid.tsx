'use client';

import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Class } from '@/features/teacher/common/types/class';

import clsx from 'clsx';

interface Props {
    classes: Class[];
    onSelect: (id: number) => void;
    onRename: (id: number, currentName: string) => void;
    onDelete: (id: number) => void;
}

export function ClassesGrid({ classes, onSelect, onRename, onDelete }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
            {classes.map((cls) => (
                <div
                    key={cls.id}
                    onClick={() => onSelect(cls.id)}
                    className={clsx(
                        'group relative bg-white border border-gray-200 rounded-xl p-5',
                        'transition-transform transition-shadow ease-out duration-200',
                        'hover:shadow-lg hover:scale-[1.02] cursor-pointer'
                    )}
                >
                    {/* edit/delete icons */}
                    <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRename(cls.id, cls.name);
                            }}
                            className="p-1 hover:bg-yellow-100 rounded cursor-pointer" 
                            aria-label="Rename Class"
                        >
                            <PencilIcon className="h-5 w-5 text-yellow-600 cursor-pointer" />
                                    </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(cls.id);
                            }}
                            className="p-1 hover:bg-red-100 rounded cursor-pointer"
                            aria-label="Delete Class"
                        >
                            <TrashIcon className="h-5 w-5 text-red-500 cursor-pointer" />
                                    </button>
                    </div>

                    {/* card content */}
                    <div className="mb-3 flex items-center">
                        <h2 className="text-lg font-medium text-gray-800">{cls.name}</h2>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                        View your sections for {cls.name}.
                    </p>
                </div>
            ))}
        </div>
    );
}
