"use client";

import { memo, useState, useEffect } from "react";
import { API_BASE } from "@/constants/env";

const OVERVIEW_STATS_DEFAULT = [
    { label: "Your Classes", value: 0 },
    { label: "Pending Retake Requests", value: 0 },
    { label: "Resolved Requests (past 30 days)", value: 0 },
];

const quickActions = [
    { label: "Create New Class", onClick: () => {} },
    { label: "Review Retake Request", onClick: () => {} },
    { label: "Add Student & Assign Work", onClick: () => {} },
] as const;

const StatCard = memo(function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center transform transition-transform duration-200 hover:scale-105 cursor-default">
            <span className="text-4xl font-bold mb-2">{value}</span>
            <span className="text-gray-500 text-center">{label}</span>
        </div>
    );
});

const ActionButton = memo(function ActionButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="bg-blue-600 text-white rounded-2xl px-6 py-3 w-full text-lg font-medium transform transition-transform duration-150 hover:scale-105 active:scale-95"
            aria-label={label}
            type="button"
        >
            {label}
        </button>
    );
});

export default function TeacherDashboardPage() {
    const [stats, setStats] = useState(OVERVIEW_STATS_DEFAULT);

    useEffect(() => {
        let isMounted = true;
        (async () => {
            try {
                const response = await fetch(`${API_BASE}/api/user/stats`, {credentials: "include"});
                if (!response.ok) throw new Error();
                const data = await response.json();
                const newStats = [
                    { label: "Your Classes", value: data.classesCount ?? 0 },
                    { label: "Pending Retake Requests", value: data.pendingRequestsCount ?? 0 },
                    { label: "Resolved Requests (past 30 days)", value: data.resolvedRequestsCount ?? 0 },
                ];
                if (isMounted) setStats(newStats);
            } catch {
                if (isMounted) setStats(OVERVIEW_STATS_DEFAULT);
            }
        })();
        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <main className="py-8 px-4 md:px-8 lg:px-16 space-y-12">
            <section>
                <h1 className="text-3xl font-bold text-center mb-6">Overview</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat) => (
                        <StatCard key={stat.label} {...stat} />
                    ))}
                </div>
            </section>
            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {quickActions.map((action) => (
                        <ActionButton key={action.label} {...action} />
                    ))}
                </div>
            </section>
        </main>
    );
}
