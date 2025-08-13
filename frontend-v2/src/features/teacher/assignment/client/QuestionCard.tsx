"use client";

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDownIcon, TrashIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionPayload } from '../../common/types/sections';

interface QuestionCardProps {
    question: QuestionPayload;
    expanded: boolean;
    toggle: () => void;
    updateQuestion: (data: Partial<{ questionText: string; answerKey: string }>) => void;
    deleteQuestion: () => void;
}

export function QuestionCard({ question, expanded, toggle, updateQuestion, deleteQuestion }: QuestionCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id });

    return (
        <motion.div
            ref={setNodeRef}
            layout
            whileDrag={{ scale: 1.05, boxShadow: '0 12px 24px rgba(0,0,0,0.2)', opacity: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
                transform: CSS.Transform.toString(transform),
                transition: transition,
                zIndex: isDragging ? 1000 : 1,
                cursor: isDragging ? 'grabbing' : 'grab',
            }}
            className="bg-white border rounded-lg p-4 shadow hover:shadow-md"
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <div
                        {...listeners}
                        {...attributes}
                        className="cursor-move p-1 hover:bg-gray-100 rounded"
                        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                    >
                        <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Question {question.sequence}</span>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={toggle}
                        className="p-1 hover:bg-gray-100 rounded transform transition-transform"
                        style={{ rotate: expanded ? '180deg' : '0deg' }}
                    >
                        <ChevronDownIcon className="h-5 w-5 text-gray-500 cursor-pointer" />
                    </button>
                    <button onClick={deleteQuestion} className="p-1 hover:bg-red-100 rounded">
                        <TrashIcon className="h-5 w-5 text-red-500 cursor-pointer" />
                    </button>
                </div>
            </div>

            {/* Collapsed view: show truncated question */}
            {!expanded && (
                <p className="mt-2 text-gray-700 text-sm truncate" title={question.questionText}>
                    {`${question.sequence}. ${question.questionText}`}
                </p>
            )}

            {/* Expanded view: full inputs */}
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="mt-3 space-y-3 overflow-hidden"
                    >
                        <textarea
                            value={question.questionText}
                            onChange={e => updateQuestion({ questionText: e.target.value })}
                            placeholder="Question text"
                            className="w-full bg-gray-50 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 resize-none"
                            rows={3}
                        />
                        <textarea
                            value={question.answerKey}
                            onChange={e => updateQuestion({ answerKey: e.target.value })}
                            placeholder="Answer (optional)"
                            className="w-full bg-gray-50 p-2 rounded-lg focus:ring-2 focus:ring-blue-200 resize-none"
                            rows={2}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
