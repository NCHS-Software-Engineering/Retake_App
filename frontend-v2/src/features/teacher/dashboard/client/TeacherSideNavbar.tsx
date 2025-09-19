"use client";
import { useState } from "react";
import Link from "next/link";
import {
    Bars3Icon,
    XMarkIcon,
    ChevronUpIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useClass } from "@/features/teacher/common/client/useClass";

export default function TeacherSideNavbar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const { classId, sectionId, assignmentId, requestId, attemptId } = useClass();

    function isValidId(id: unknown): id is number {
        return typeof id === "number" && id > 0;
    }

    const classesBase = "/dashboard/teacher/classes";
    const requestsBase = "/dashboard/teacher/requests";

    const classesHref = isValidId(classId)
        ? `${classesBase}/${classId}`
        : classesBase;

    const sectionsHref =
        isValidId(classId) && isValidId(sectionId)
            ? `${classesHref}/sections/${sectionId}`
            : classesBase;

    const assignmentHref =
        isValidId(classId) &&
            isValidId(sectionId) &&
            isValidId(assignmentId)
            ? `${sectionsHref}/assignments/${assignmentId}`
            : classesBase;

    const requestsHref = requestsBase;

    const viewSubmissionHref =
        isValidId(requestId) && isValidId(attemptId)
            ? `${requestsBase}/${requestId}/attempt/${attemptId}`
            : requestsBase;

    const navSections = [
        {
            title: "Manage Class Content",
            links: [
                { href: classesBase, label: "Classes" },
                { href: classesHref, label: "Sections" },
                { href: assignmentHref, label: "Assignment" },
            ],
        },
        {
            title: "Manage Retake Requests",
            links: [
                { href: requestsHref, label: "Pending Requests" },
                { href: viewSubmissionHref, label: "View Submission" },
            ],
        },
      ];

    return (
        <>
            {/* Mobile Hamburger */}
            <button
                className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md md:hidden shadow"
                onClick={() => setIsMobileOpen(true)}
                aria-label="Open sidebar"
            >
                <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
    fixed top-16 left-0 z-50 w-64 transform transition-transform
    ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
    md:fixed md:top-16 md:h-screen md:w-64
    ${isCollapsed ? "md:w-16" : "md:w-64"}
    bg-white border-r overflow-y-auto
  `}

            >
                {/* Mobile Close */}
                <div className="flex justify-end p-4 md:hidden">
                    <button onClick={() => setIsMobileOpen(false)} aria-label="Close sidebar">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Desktop Header Collapse */}
                <div className="hidden md:flex items-center justify-between p-4 border-b">
                    <span className="font-semibold text-lg">Dashboard</span>
                    <button
                        onClick={() => setIsCollapsed((c) => !c)}
                        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronDownIcon className="h-6 w-6" />
                        ) : (
                            <ChevronUpIcon className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Links */}
                {!isCollapsed && (
                    <nav className="pt-4 px-4 pb-4">
                        {navSections.map((section) => (
                            <div key={section.title} className="mb-6">
                                <h3 className="text-gray-600 uppercase text-xs font-semibold mb-2">
                                    {section.title}
                                </h3>
                                <ul className="space-y-1">
                                    {section.links.map((link) => (
                                        <li key={`${section.title}-${link.label}`}>
                                        <Link
                                                href={link.href}
                                                className="block py-2 px-3 rounded hover:bg-gray-100"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
                )}
            </aside>
        </>
    );
}
