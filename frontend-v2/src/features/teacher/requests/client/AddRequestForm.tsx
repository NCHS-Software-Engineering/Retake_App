import React, { useEffect, useState } from "react";
import { FaSearch, FaArrowRight, FaArrowLeft, FaPlus } from "react-icons/fa";
import { getSearchStudentUsers, getClassesData } from "../services/requests";
import type { StudentPayload, ClassData } from "../types/request";

type Props = {
    onCreate: (studentId: number, assignmentId: number, notes: string) => Promise<void>;
};

export default function AddRequestForm({ onCreate }: Props) {
    const [step, setStep] = useState(1);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<StudentPayload[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<StudentPayload | null>(null);
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [selectedClass, setSelectedClass] = useState<number | "">("");
    const [selectedSection, setSelectedSection] = useState<number | "">("");
    const [selectedAssignment, setSelectedAssignment] = useState<number | "">("");
    const [notes, setNotes] = useState("");
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingClasses, setLoadingClasses] = useState(false);

    // fetch classes once when entering step 2
    useEffect(() => {
        if (step === 2 && classes.length === 0) {
            setLoadingClasses(true);
            getClassesData()
                .then((data) => setClasses(data))
                .finally(() => setLoadingClasses(false));
        }
    }, [step, classes]);

    const next = () => {
        if (step === 1 && !selectedStudent) return;
        if (step === 2 && !selectedAssignment) return;
        setStep((s) => Math.min(s + 1, 3));
    };
    const back = () => setStep((s) => Math.max(s - 1, 1));

    const search = async () => {
        if (!query.trim()) return;
        setLoadingSearch(true);
        try {
            setResults(await getSearchStudentUsers(query.trim()));
        } finally {
            setLoadingSearch(false);
        }
    };

    const handleCreate = async () => {
        if (selectedStudent && selectedAssignment) {
            await onCreate(selectedStudent.id, Number(selectedAssignment), notes.trim());
            // reset
            setStep(1);
            setQuery("");
            setResults([]);
            setSelectedStudent(null);
            setClasses([]);
            setSelectedClass("");
            setSelectedSection("");
            setSelectedAssignment("");
            setNotes("");
        }
    };

    const currentSections =
        classes.find((c) => c.id === selectedClass)?.sections || [];
    const currentAssignments =
        currentSections.find((s) => s.id === selectedSection)?.assignments || [];

    return (
        <div className="w-full max-w-lg mx-auto p-6 rounded-lg flex flex-col" style={{ minHeight: '450px' }}>
            {/* Step Header */}
            <div className="flex justify-between mb-4 text-lg font-bold">
                <div className={step >= 1 ? "text-blue-600" : "text-gray-400"}>1. Student</div>
                <div className={step >= 2 ? "text-blue-600" : "text-gray-400"}>2. Assignments</div>
                <div className={step >= 3 ? "text-blue-600" : "text-gray-400"}>3. Notes</div>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-auto">
                    {/* Step 1: Student Search */}
                    {step === 1 && (
                        <div className="relative w-full max-w-sm">
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 bg-gray-100 rounded-xl text-sm placeholder-gray-500 focus:outline-none"
                                    placeholder="Search students..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), search())}
                                />
                                <button
                                    type="button"
                                    aria-label="Search"
                                    onClick={search}
                                    disabled={loadingSearch}
                                    className="ml-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
                                >
                                    <FaSearch className="text-white" size={18} />
                                </button>
                            </div>
                            <ul className="border rounded-lg max-h-64 overflow-auto bg-white shadow mt-2">
                                {results.map((s) => (
                                    <li
                                        key={s.id}
                                        onClick={() => setSelectedStudent(s)}
                                        className={`px-2 py-2 cursor-pointer hover:bg-blue-50 transition text-sm rounded ${selectedStudent?.id === s.id ? 'bg-blue-100' : ''}`}
                                    >
                                        <div>
                                            <span className="font-semibold">{s.username}</span>
                                            <span className="ml-2 text-gray-500">{s.email}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Step 2: Assignments */}
                    {step === 2 && (
                        <div className="flex flex-col space-y-4">
                            {loadingClasses ? (
                                <p>Loading...</p>
                            ) : (
                                <>
                                    <select
                                        value={selectedClass}
                                        onChange={(e) => { setSelectedClass(Number(e.target.value)); setSelectedSection(""); setSelectedAssignment(""); }}
                                        className="w-full p-3 border rounded-lg text-lg focus:outline-none"
                                    >
                                        <option value="">Select Class</option>
                                        {classes.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={selectedSection}
                                        onChange={(e) => { setSelectedSection(Number(e.target.value)); setSelectedAssignment(""); }}
                                        disabled={!selectedClass}
                                        className="w-full p-3 border rounded-lg text-lg focus:outline-none"
                                    >
                                        <option value="">Select Section</option>
                                        {currentSections.map((s) => (
                                            <option key={s.id} value={s.id}>{s.name}</option>
                                        ))}
                                    </select>

                                    <select
                                        value={selectedAssignment}
                                        onChange={(e) => setSelectedAssignment(Number(e.target.value))}
                                        disabled={!selectedSection}
                                        className="w-full p-3 border rounded-lg text-lg focus:outline-none"
                                    >
                                        <option value="">Select Assignment</option>
                                        {currentAssignments.map((a) => (
                                            <option key={a.id} value={a.id}>{a.title}</option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </div>
                    )}

                    {/* Step 3: Notes */}
                    {step === 3 && (
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

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={next}
                            disabled={(step === 1 && !selectedStudent) || (step === 2 && !selectedAssignment)}
                            className="p-3 bg-blue-600 text-white rounded-lg flex items-center justify-center disabled:opacity-50 hover:bg-blue-700 cursor-pointer"
                        >
                            <FaArrowRight size={20} />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleCreate}
                                className="p-3 bg-green-600 text-white rounded-lg flex items-center justify-center hover:bg-green-700 cursor-pointer"
                        >
                            <FaPlus size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
