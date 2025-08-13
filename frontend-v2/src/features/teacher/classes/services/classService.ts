import { API_BASE } from "@/constants/env";
import type { Class } from "@/features/teacher/common/types/class";

export async function getClasses(): Promise<Class[]> {
    const res = await fetch(`${API_BASE}/api/classes`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch classes");
    return res.json();
}

export async function createClass(name: string): Promise<Class> {
    const res = await fetch(`${API_BASE}/api/classes`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to create class");
    return res.json();
}

export async function renameClass(id: number, name: string): Promise<void> {
    const res = await fetch(`${API_BASE}/api/classes/${id}`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to rename class");
}

export async function deleteClass(id: number): Promise<void> {
    const res = await fetch(`${API_BASE}/api/classes/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete class");
}
