"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useClass } from '@/features/teacher/common/client/useClass';
import { useSections } from './useSections';

import { PageHeader } from '@/shared/ui/PageHeader';
import { Modal } from '@/shared/ui/Modal';

import { AddSectionForm } from './AddSectionForm';
import { RenameSectionForm } from './RenameSectionForm';
import { DeleteSectionForm } from './DeleteSectionForm';
import { SectionsGrid } from './SectionsGrid';

export default function ClassPage() {
    const { setClassId, setSectionId } = useClass();
    const { classId: paramId } = useParams();
    const router = useRouter();

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [renameTarget, setRenameTarget] = useState<{ id: number; currentName: string } | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; currentName: string } | null>(null);

    const { sections, loading, addSection, doRename, doDelete } = useSections();

    // sync context if landed directly
    useEffect(() => {
        if (paramId && !Array.isArray(paramId)) {
            setClassId(Number(paramId));
        }
    }, [paramId, setClassId]);

    const handleSelect = useCallback(
        (secId: number) => {
            setSectionId(secId);
            router.push(
                `/dashboard/teacher/classes/${paramId}/sections/${secId}`
            );
        },
        [paramId, router, setSectionId]
    );

    if (loading) return <p>Loading sections…</p>;

    return (
        <div className="p-6">
            <PageHeader
                title="Your Sections"
                buttonName="Add Section"
                onCreateClick={() => setIsCreateOpen(true)}
            />

            {/* Create Section */}
            <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)}>
                <AddSectionForm
                    onCreate={async (name) => {
                        await addSection(name);
                        setIsCreateOpen(false);
                    }}
                />
            </Modal>

            {/* Rename Section */}
            <Modal
                isOpen={!!renameTarget}
                onClose={() => setRenameTarget(null)}
            >
                {renameTarget && (
                    <RenameSectionForm
                        initialName={renameTarget.currentName}
                        onRename={async (newName) => {
                            await doRename(renameTarget.id, newName);
                            setRenameTarget(null);
                        }}
                    />
                )}
            </Modal>

            {/* Delete Section */}
            <Modal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
            >
                {deleteTarget && (
                    <DeleteSectionForm
                        sectionName={deleteTarget.currentName}
                        onDelete={async () => {
                            await doDelete(deleteTarget.id);
                            setDeleteTarget(null);
                        }}
                    />
                )}
            </Modal>

            {sections.length > 0 ? (
                <SectionsGrid
                    sections={sections}
                    onSelect={handleSelect}
                    onRename={(id, name) => setRenameTarget({ id, currentName: name })}
                    onDelete={(id) => {
                        const sec = sections.find((s) => s.id === id);
                        if (sec) setDeleteTarget({ id, currentName: sec.name });
                    }}
                    onSelectAssignment={(id) =>
                        router.push(
                            `/dashboard/teacher/classes/${paramId}/sections/${id}/assignments/${id}`
                        )
                    }
                />
            ) : (
                <p className="text-gray-600 mt-4">No sections yet for this class.</p>
            )}
        </div>
    );
}