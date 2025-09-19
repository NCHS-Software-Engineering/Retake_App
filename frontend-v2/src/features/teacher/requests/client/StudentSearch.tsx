"use client";

import React, {
    FC,
    ChangeEvent,
    useEffect,
    useRef,
} from "react";

export interface StudentSearchBarProps {
    query: string;
    onChange: (newQuery: string) => void;
    fetchStudents: () => Promise<void>;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    debounceMs?: number;
}

export const StudentSearchBar: FC<StudentSearchBarProps> = ({
    query,
    onChange,
    fetchStudents,
    setLoading,
    debounceMs = 3000,
}) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const firstRun = useRef(true);

    useEffect(() => {
        // never run on first mount
        if (firstRun.current) {
            firstRun.current = false;
            return;
        }

        // always clear any pending
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        // if the query is empty, we bail out entirely
        if (!query.trim()) {
            setLoading(false);
            return;
        }

        setLoading(true);

        timerRef.current = setTimeout(async () => {
            try {
                await fetchStudents();
            } finally {
                setLoading(false);
            }
        }, debounceMs);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [query, fetchStudents, debounceMs, setLoading]);

    return (
        <div className="relative w-full max-w-sm">
            <div className="flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        onChange(e.target.value)
                    }
                    placeholder="Search students…"
                    className="w-full px-4 py-2 bg-gray-100 rounded-xl text-sm placeholder-gray-500 focus:outline-none"
                />
                <button
                    type="button"
                    aria-label="Search"
                    onClick={() => {
                        if (timerRef.current) clearTimeout(timerRef.current);
                        setLoading(true);
                        fetchStudents()
                            .finally(() => setLoading(false));
                    }}
                    className="ml-2 p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition cursor-pointer"
                >
                    <svg
                        className="h-5 w-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <line x1="16.5" y1="16.5" x2="21" y2="21" />
                    </svg>
                </button>
            </div>
        </div>
    );
};
