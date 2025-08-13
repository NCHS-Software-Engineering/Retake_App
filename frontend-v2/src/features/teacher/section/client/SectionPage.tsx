"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import type { Assignment } from "@/features/teacher/common/types/sections";

import { useSection } from './useSection';

import { useClass } from '@/features/teacher/common/client/useClass';

import {AssignmentColumn} from './AssignmentColumn';
import SectionHeader from './SectionHeader';
import RenameSectionForm from './RenameSectionForm';
import DeleteSectionForm from './DeleteSectionForm';
import EditAssignmentForm from './EditAssignmentForm';
import DeleteAssignmentForm from './DeleteAssignmentForm';
import CreateAssignmentForm from './CreateAssignmentForm';

import { Modal } from '@/shared/ui/Modal';

// Central list of assignment types
const ALL_TYPES: Assignment['type'][] = ['test', 'relearning'];

export default function SectionPage() {
    const router = useRouter();
    const { classId: rawClassId, sectionId: rawSectionId } = useParams() as {
        classId?: string;
        sectionId?: string;
    };

    // Sync URL params into context
    const { sectionId, setSectionId, setAssignmentId } = useClass();
    useEffect(() => {
        if (rawSectionId && !Array.isArray(rawSectionId)) {
            setSectionId(Number(rawSectionId));
        }
    }, [rawSectionId, setSectionId]);

    // Local UI state
    const [isRenamingSection, setIsRenamingSection] = useState(false);
    const [isDeletingSection, setIsDeletingSection] = useState(false);
    const [isCreateAssignment, setIsCreateAssignment] = useState(false);
    const [editAssignmentId, setEditAssignmentId] = useState<number | null>(null);
    const [deletingAssignmentId, setDeletingAssignmentId] = useState<number | null>(null);

    // Data & actions from hook
    const classIdNum = rawClassId ? Number(rawClassId) : 0;
    const {
        section,
        loading,
        error,
        refetch,
        doRenameSection,
        doDeleteSection,
        doEditAssignment,
        doDeleteAssignment,
        doCreateAssignment,
    } = useSection(classIdNum, sectionId);

    // Handlers
    const handleSelectAssignment = (assignmentId: number) => {
        setAssignmentId(assignmentId);
        router.push(
            `/dashboard/teacher/classes/${classIdNum}/sections/${sectionId}/assignments/${assignmentId}`
        );
    };

    const handleSectionRename = async (newName: string) => {
        await doRenameSection(newName);
        await refetch();
        setIsRenamingSection(false);
    };

    const handleSectionDelete = async () => {
        await doDeleteSection();
        router.push(`/dashboard/teacher/classes/${classIdNum}`);
    };

    const handleAssignmentRename = async (data: { title: string; description: string }) => {
        if (editAssignmentId == null) return;
        await doEditAssignment(editAssignmentId, data);
        await refetch();
        setEditAssignmentId(null);
    };

    const handleAssignmentDelete = async () => {
        if (deletingAssignmentId == null) return;
        await doDeleteAssignment(deletingAssignmentId);
        await refetch();
        setDeletingAssignmentId(null);
    };

    const handleAssignmentCreate = async (data: { type: string, title: string, description: string }) => {
        await doCreateAssignment(data);
        await refetch();
        setIsCreateAssignment(false);
    }

    // Fetch current assignment for forms
    const currentAssignment =
        section?.assignments.find((a) => a.id === editAssignmentId) || null;

    const deletingAssignment =
        section?.assignments.find((a) => a.id === deletingAssignmentId) || null;

    return (
        <div className="p-6">
            <SectionHeader
                name={section?.name ?? 'Section'}
                onRename={() => setIsRenamingSection(true)}
                onDelete={() => setIsDeletingSection(true)}
                onCreateAssignment={() => setIsCreateAssignment(true)}
            />

            {loading && <p className="italic">Loading section...</p>}
            {error && <p className="text-red-600">Error: {error.message}</p>}

            {/* Section Rename Modal */}
            <Modal isOpen={isRenamingSection} onClose={() => setIsRenamingSection(false)}>
                <RenameSectionForm
                    initialName={section?.name ?? ''}
                    onRename={handleSectionRename}
                />
            </Modal>

            {/* Section Delete Modal */}
            <Modal isOpen={isDeletingSection} onClose={() => setIsDeletingSection(false)}>
                <DeleteSectionForm
                    sectionName={section?.name ?? ''}
                    onDelete={handleSectionDelete}
                />
            </Modal>

            {/* Create new Assignment */}
            <Modal isOpen={isCreateAssignment} onClose={() => setIsCreateAssignment(false)}>
                <CreateAssignmentForm onCreate={handleAssignmentCreate} />
            </Modal>

            {/* Assignment Rename Modal */}
            <Modal isOpen={!!editAssignmentId} onClose={() => setEditAssignmentId(null)}>
                {currentAssignment && (
                    <EditAssignmentForm
                        initialTitle={currentAssignment.title}
                        initialDescription={currentAssignment.description}
                        onEdit={handleAssignmentRename}
                    />
                )}
            </Modal>

            {/* Assignment Delete Modal */}
            <Modal isOpen={!!deletingAssignmentId} onClose={() => setDeletingAssignmentId(null)}>
                {deletingAssignment && (
                    <DeleteAssignmentForm
                        assignmentTitle={deletingAssignment.title}
                        onDelete={handleAssignmentDelete}
                    />
                )}
            </Modal>

            {/* Assignment Columns */}
            {section && (
                <div className="flex flex-row flex-wrap gap-6">
                    {ALL_TYPES.map((type) => (
                        <AssignmentColumn
                            key={type}
                            type={type}
                            assignments={section.assignments.filter((a) => a.type === type)}
                            onSelect={handleSelectAssignment}
                            onEditAssignment={(id) => setEditAssignmentId(id)}
                            onDeleteAssignment={(id) => setDeletingAssignmentId(id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
