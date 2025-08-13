"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    DndContext,
    closestCenter,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    CheckIcon,
    TrashIcon,
    DocumentPlusIcon,
    CloudArrowUpIcon,
} from '@heroicons/react/24/outline';
import { useAssignment } from './useAssignment';
import { QuestionCard } from './QuestionCard';
import clsx from 'clsx';

export default function AssignmentPage() {
    const { classId, sectionId, assignmentId } = useParams();
    const router = useRouter();
    const cId = Number(classId), sId = Number(sectionId), aId = Number(assignmentId);
    const {
        assignment,
        loading,
        error,
        doEditAssignment,
        doDeleteAssignment,
        doAddQuestion,
        doUpdateQuestion,
        doDeleteQuestion,
        doReorderQuestions,
    } = useAssignment(cId, sId, aId);

    // header state...
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dirty, setDirty] = useState(false);
    const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    useEffect(() => {
        if (assignment) {
            setTitle(assignment.title);
            setDescription(assignment.description || '');
        }
    }, [assignment]);
    useEffect(() => {
        if (!dirty) return;
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => {
            doEditAssignment({ title, description });
            setDirty(false);
        }, 1000);
        return () => clearTimeout(saveTimer.current);
    }, [title, description, dirty, doEditAssignment]);
    const handleSaveClick = () => {
        clearTimeout(saveTimer.current);
        doEditAssignment({ title, description });
        setDirty(false);
    };

    // questions state...
    const [questions, setQuestions] = useState(assignment?.questions || []);
    useEffect(() => { if (assignment) setQuestions(assignment.questions); }, [assignment]);
    const updateTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});
    const questionsRef = useRef(questions);
    useEffect(() => { questionsRef.current = questions; }, [questions]);
    const handleUpdate = useCallback((id: number, data: Partial<{ questionText: string; answerKey: string }>) => {
        setQuestions(qs => qs.map(q => q.id === id ? { ...q, ...data } : q));
        clearTimeout(updateTimers.current[id]);
        updateTimers.current[id] = setTimeout(() => {
            const q = questionsRef.current.find(q => q.id === id);
            if (q) doUpdateQuestion(id, { questionText: q.questionText, answerKey: q.answerKey });
        }, 1000);
    }, [doUpdateQuestion]);
    const handleDelete = (id: number) => {
        doDeleteQuestion(id);
        setQuestions(qs => qs.filter(q => q.id !== id));
    };
    const handleAdd = async () => {
        const newQ = await doAddQuestion();
        setQuestions(prev => [...prev, newQ]);
        setExpandSet(prev => new Set(prev).add(newQ.id));
    };

    // expand
    const [expandSet, setExpandSet] = useState<Set<number>>(new Set());
    useEffect(() => { if (questions.length) setExpandSet(new Set(questions.map(q => q.id))); }, [questions]);
    const allExpanded = expandSet.size === questions.length;
    const toggleAll = () => setExpandSet(allExpanded ? new Set() : new Set(questions.map(q => q.id)));

    // drag
    const [activeId, setActiveId] = useState<string | null>(null);
    const handleDragStart = ({ active }: DragStartEvent) => setActiveId(active.id.toString());
    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        setActiveId(null);
        if (!over || active.id === over.id) return;
        setQuestions(prev => {
            const oldIdx = prev.findIndex(q => q.id.toString() === active.id.toString());
            const newIdx = prev.findIndex(q => q.id.toString() === over.id.toString());
            const reordered = arrayMove(prev, oldIdx, newIdx).map((q, i) => ({ ...q, sequence: i + 1 }));
            doReorderQuestions(reordered.map(q => q.id));
            return reordered;
        });
    };

    if (loading) return <p className="text-center py-10 text-gray-500">Loading…</p>;
    if (error) return <p className="text-red-600">Error: {error.message}</p>;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <input
                    value={title}
                    onChange={e => { setTitle(e.target.value); setDirty(true); }}
                    className="text-3xl font-bold truncate focus:outline-none h-14"
                    placeholder="Assignment Title"
                />
                <div className="flex space-x-3 border-b border-gray-200 pb-1">
                    <button onClick={handleSaveClick} disabled={!dirty} className={clsx('p-1 rounded', dirty ? 'hover:bg-gray-200' : 'opacity-50 cursor-not-allowed')}><CheckIcon className="h-6 w-6 text-blue-600" /></button>
                    <button
                        onClick={() => doDeleteAssignment().then(() => router.push(`/assignments/${cId}/sections/${sId}`))}
                        className="p-1 hover:bg-gray-200 rounded"
                    >
                        <TrashIcon className="h-6 w-6 text-red-600 cursor-pointer" />
                    </button>              </div>
            </div>
            <h3 className="text-sm uppercase text-gray-500">TYPE: {assignment?.type}</h3>
            <textarea
                value={description}
                onChange={e => { setDescription(e.target.value); setDirty(true); }}
                className="w-full text-base italic focus:outline-none resize-none h-20 mb-4"
                placeholder="Add an optional description..."
            />

            {/* Controls */}
            <div className="flex items-center space-x-4">
                <button onClick={handleAdd} className="inline-flex items-center space-x-2 px-3 hover:bg-green-50 rounded"><DocumentPlusIcon className="h-5 w-5 text-green-600" /><span className="text-base text-green-600 cursor-pointer">Add Question</span></button>
                <button className="inline-flex items-center space-x-2 px-3 hover:bg-gray-100 rounded"><CloudArrowUpIcon className="h-5 w-5 text-gray-600" /><span className="text-base text-gray-600 cursor-pointer">Upload File</span></button>
                {questions.length > 0 && <button onClick={toggleAll} className="ml-auto px-3 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 cursor-pointer">{allExpanded ? 'Collapse All' : 'Expand All'}</button>}
            </div>

            {/* Questions */}
            <section className="space-y-4 pt-4">
                {questions.length === 0 ? (
                    <div className="text-center text-gray-500 py-12 text-lg">No questions yet.</div>
                ) : (
                    <DndContext
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        autoScroll={{
                            threshold: { x: 0, y: .1 },
                        }}
                        // dropAnimation={{
                        //     duration: 200,
                        //     easing: 'ease-out',
                        //     sideEffects: defaultDropAnimationSideEffects({
                        //         styles: { active: { opacity: '0.8' } },
                        //     }),
                        // }}
                    >
                        <SortableContext
                            items={questions.map(q => q.id.toString())}
                            strategy={verticalListSortingStrategy}
                        >
                            {questions.map(q => (
                                <QuestionCard
                                    key={q.id}
                                    question={q}
                                    expanded={expandSet.has(q.id)}
                                    toggle={() =>
                                        setExpandSet(prev => {
                                            const next = new Set(prev);
                                            if (next.has(q.id)) {
                                                next.delete(q.id);
                                            } else {
                                                next.add(q.id);
                                            }
                                            return next;
                                        })
                                    }
                                    updateQuestion={data => handleUpdate(q.id, data)}
                                    deleteQuestion={() => handleDelete(q.id)}
                                />
                            ))}
                        </SortableContext>

                            <DragOverlay>
                                {activeId ? (
                                    <QuestionCard
                                        question={questions.find(q => q.id.toString() === activeId)!}
                                        expanded={expandSet.has(Number(activeId))}
                                        toggle={() => { }}
                                        updateQuestion={() => { }}
                                        deleteQuestion={() => { }}
                                    />
                                ) : null}
                            </DragOverlay>
                    </DndContext>
                )}
            </section>
        </div>
    );
}
