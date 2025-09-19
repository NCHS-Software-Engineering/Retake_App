'use client';
import React, { FC, useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { searchTeachers, createRetakeRequest } from '../services/requests';
import type { TeacherPayload } from '../types/request';
import { FaSearch, FaArrowRight, FaArrowLeft, FaPlus } from 'react-icons/fa';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    refetch: () => void;
}

export const AddRequestModal: FC<Props> = ({ isOpen, onClose, refetch }) => {
    const [step, setStep] = useState(1);
    const [query, setQuery] = useState('');
    const [teachers, setTeachers] = useState<TeacherPayload[]>([]);
    const [selected, setSelected] = useState<TeacherPayload | null>(null);
    const [notes, setNotes] = useState('');
    const [loadingSearch, setLoadingSearch] = useState(false);

    const next = () => {
        if (step === 1 && !selected) return;
        setStep((s) => Math.min(s + 1, 3));
    };
    const back = () => setStep((s) => Math.max(s - 1, 1));

    const search = async () => {
        if (!query.trim()) return;
        setLoadingSearch(true);
        try {
            setTeachers(await searchTeachers(query.trim()));
        } finally {
            setLoadingSearch(false);
        }
    };

    const doSubmit = async () => {
        if (!selected) return;
        await createRetakeRequest(selected.id, notes.trim());
        // reset
        onClose();
        setStep(1);
        setQuery('');
        setSelected(null);
        setNotes('');
        refetch();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-lg mx-auto p-6 rounded-lg flex flex-col" style={{ minHeight: '450px' }}>

                {/* Step Header */}
                <div className="flex justify-between mb-2 text-lg font-bold px-10">
                    <div className={step >= 1 ? "text-blue-600" : "text-gray-400"}>1. Teacher</div>
                    <div className={step >= 2 ? "text-blue-600" : "text-gray-400"}>2. Notes</div>
                </div>


                <div className="flex-1 flex flex-col">
                    <div className="flex-1 overflow-auto">
                        {/* Step 1: Teacher Search */}
                        {step === 1 && (
                            <div className="relative w-full max-w-sm">
                                <div className="flex items-center">
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 bg-gray-100 rounded-xl text-sm placeholder-gray-500 focus:outline-none"
                                        placeholder="Search teachers..."
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), search())}
                                    />
                                    <button
                                        type="button"
                                        aria-label="Search"
                                        onClick={search}
                                        disabled={loadingSearch}
                                        className="ml-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center cursor-pointer"
                                    >
                                        <FaSearch className="text-white" size={18} />
                                    </button>
                                </div>
                                <ul className="border rounded-lg max-h-64 overflow-auto bg-white shadow mt-2">
                                    {teachers.map((t) => (
                                        <li
                                            key={t.id}
                                            onClick={() => setSelected(t)}
                                            className={`px-2 py-2 cursor-pointer hover:bg-blue-50 transition text-sm rounded ${selected?.id === t.id ? 'bg-blue-100' : ''
                                                }`}
                                        >
                                            <span className="font-semibold">{t.username}</span> —{' '}
                                            <span className="text-gray-500">{t.email}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}


                        {/* Step 2: Notes */}
                        {step === 2 && (
                            <div className="flex flex-col space-y-2">
                                <textarea
                                    className="w-full h-40 p-3 border rounded-lg text-lg focus:outline-none"
                                    placeholder="Add optional notes..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        )}

                    </div>
                </div>

                {/* Navigation */}
                <div className="mt-4 flex justify-between">
                    <button
                        type="button"
                        onClick={back}
                        disabled={step === 1}
                        className="p-3 bg-gray-200 rounded-lg flex items-center justify-center disabled:opacity-50 cursor-pointer"
                    >
                        <FaArrowLeft size={20} />
                    </button>

                    {step < 2 ? (
                        <button
                            type="button"
                            onClick={next}
                            disabled={(step === 1 && !selected)}
                            className="p-3 bg-blue-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 cursor-pointer"
                        >
                            <FaArrowRight size={20} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={doSubmit}
                                className="p-3 bg-green-600 text-white rounded-lg flex items-center justify-center hover:bg-green-700 cursor-pointer"
                        >
                            <FaPlus size={20} />
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};