import { Section, SectionDTO } from "@/features/teacher/common/types/sections";
import { API_BASE } from '@/constants/env';

export async function getSections(classId: number): Promise<SectionDTO> {
    const res = await fetch(`${API_BASE}/api/classes/${classId}`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Failed to fetch sections (${res.status})`);
    return res.json();
}

export async function getSection(classId: number, sectionId: number): Promise<Section> {
    const res = await fetch(`${API_BASE}/api/classes/${classId}/sections/${sectionId}`, {
        credentials: 'include',
    });
    if (!res.ok) throw new Error(`Failed to fetch section (${res.status})`);
    return res.json();
}

export async function createSection(
    classId: number,
    name: string
): Promise<Section> {
    
    const res = await fetch(
        `${API_BASE}/api/classes/${classId}/sections`,
        {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sectionName: name }),
        }
    );
    if (!res.ok) throw new Error(`Failed to create section (${res.status})`);
    return res.json();
}

// Updated to include classId in URL
export async function renameSection(
    classId: number,
    sectionId: number,
    newName: string
): Promise<void> {
    const res = await fetch(
        `${API_BASE}/api/classes/${classId}/sections/${sectionId}`,
        {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sectionName: newName }),
        }
    );
    if (!res.ok) throw new Error(`Failed to rename section (${res.status})`);
}

// Updated to include classId in URL
export async function deleteSection(
    classId: number,
    sectionId: number
): Promise<void> {
    const res = await fetch(
        `${API_BASE}/api/classes/${classId}/sections/${sectionId}`,
        {
            method: 'DELETE',
            credentials: 'include',
        }
    );
    if (!res.ok) throw new Error(`Failed to delete section (${res.status})`);
  }