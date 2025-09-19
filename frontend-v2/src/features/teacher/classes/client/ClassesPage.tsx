"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClass } from "@/features/teacher/common/client/useClass";
import { useClasses } from "./useClasses";
import { PageHeader } from "@/shared/ui/PageHeader";
import { ClassesGrid } from "./ClassesGrid";
import { AddClassForm } from "./AddClassForm";
import { RenameClassForm } from "./RenameClassForm";
import { DeleteClassForm } from "./DeleteClassForm";
import { Modal } from "@/shared/ui/Modal";

export default function ClassesPage() {
    const router = useRouter();
    const { setClassId } = useClass();
    const { classes, loading, error, refresh, addClass, doRename, doDelete } = useClasses();

    const [isCreateOpen, setCreateOpen] = useState(false);
    const [renameTarget, setRenameTarget] = useState<{ id: number; name: string } | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ id: number; name: string } | null>(null);

    const handleSelect = (id: number) => {
        setClassId(id);
        router.push(`/dashboard/teacher/classes/${id}`);
    };
    const handleRename = (id: number, name: string) => setRenameTarget({ id, name });
    const handleDelete = (id: number) => {
        const t = classes.find((c) => c.id === id);
        if (t) setDeleteTarget({ id: t.id, name: t.name });
    };

    if (loading) return <p className="p-6">Loading classes…</p>;
    if (error) return (
        <div className="p-6 text-red-600">
            <p>Failed to load classes.</p>
            <button onClick={refresh} className="underline">Try again</button>
        </div>
    );

    return (
        <div className="p-6">
            <PageHeader
                title="Your Classes"
                buttonName="Add Class"
                onCreateClick={() => setCreateOpen(true)}
            />

            {classes.length === 0 ? (
                <p className="text-center text-gray-500 py-12">You have no classes yet. Create one to get started!</p>
            ) : (
                <ClassesGrid
                    classes={classes}
                    onSelect={handleSelect}
                    onRename={handleRename}
                    onDelete={handleDelete}
                />
            )}

            {/* Add Modal */}
            <Modal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)}>
                <AddClassForm
                    onCreate={async (name) => { await addClass(name); setCreateOpen(false); }}
                    onClose={() => setCreateOpen(false)}
                />
            </Modal>

            {/* Rename Modal */}
            <Modal isOpen={!!renameTarget} onClose={() => setRenameTarget(null)}>
                {renameTarget && (
                    <RenameClassForm
                        initialName={renameTarget.name}
                        onRename={async (newName) => {
                            await doRename(renameTarget.id, newName);
                            setRenameTarget(null);
                        }}
                    />
                )}
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
                {deleteTarget && (
                    <DeleteClassForm
                        className={deleteTarget.name}
                        onDelete={async () => {
                            await doDelete(deleteTarget.id);
                            setDeleteTarget(null);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
}
