import { promises } from "dns";
import prisma from "../../../config/db";

interface ClassDto {
    id: number;
    name: string;
}

interface SectionDto {
    id: number;
    name: string;
}

interface ClassContentDto {
    classId: number;
    className: string;
    sections: SectionDto[];
}

export class ClassService {

    /**
     * Retrieves all classes for a given teacher.
     * @param teacherId - The ID of the teacher.
     * @returns A promise that resolves to an array of ClassDto objects.
     */
    public async getAllClasses(teacherId: number): Promise<ClassDto[]> {
        const classes = await prisma.class.findMany({
            where: {
                teacherId: teacherId
            },
            select: {
                id: true,
                name: true
            }
        });

        return classes.map(c => ({
            id: c.id,
            name: c.name

        }));
    }

    public async getAllClassesData(teacherId: number) {
        const classesData = await prisma.class.findMany({
            where: {
                teacherId: teacherId
            },
            select: {
                id: true,
                name: true,
                sections: {
                    select: {
                        id: true,
                        name: true,
                        assignments: {
                            select: {
                                id: true,
                                type: true,
                                title: true
                            }
                        }
                    }
                }
            }
        })
        if (!classesData) {
            throw new Error("Class not found or you do not have permission to access it.");
        }

        return classesData;
    }

    /**
     * Gets all the sections with their content for a given class.
     * @param teacherId - The ID of the teacher.
     * @param classId - The ID of the class.
     */
    public async getClassContentById(teacherId: number, classId: number): Promise<ClassContentDto> {
        const classData = await prisma.class.findFirst({
            where: {
                id: classId,
                teacherId: teacherId
            },
            select: {
                id: true,
                name: true,
                sections: {
                    select: {
                        id: true,
                        name: true,
                        assignments: {
                            select: {
                                id: true,
                                type: true,
                                title: true,
                                description: true,
                            }
                        }
                    }
                }
            }
        });

        if (!classData) {
            throw new Error("Class not found or you do not have permission to access it.");
        }

        return {
            classId: classData.id,
            className: classData.name,
            sections: classData.sections.map(section => ({
                id: section.id,
                name: section.name,
                assignments: section.assignments // include assignments if needed
            }))
        };
    }

    /**
     * Creates a new class for a specific teacher.
     * @param teacherId - The ID of the teacher.
     * @param name - The name of the new class.
     */
    public async createNewClass(teacherId: number, name: string): Promise<ClassDto> {
        // Check if the class name already exists for the teacher
        const existingClass = await prisma.class.findFirst({
            where: {
                name: name,
                teacherId: teacherId
            }
        });        
        if (existingClass) {
            throw new Error("Class with this name already exists.");
        }

        // Create the class
        const newClass = await prisma.class.create({
            data: {
                name: name,
                teacherId: teacherId
            }
        });

        return {
            id: newClass.id,
            name: newClass.name
        };
    }

    /**
     * Edits the name of an existing class for a specific teacher.
     * @param teacherId - The ID of the teacher.
     * @param classId - The ID of the class to edit.
     * @param newName - The new name for the class.
     */
    public async editClass(teacherId: number, classId: number, newName: string): Promise<ClassDto> {
        // Check if the class exists and belongs to the teacher
        const existingClass = await prisma.class.findFirst({
            where: {
                id: classId,
                teacherId: teacherId
            }
        });
        if (!existingClass) {
            throw new Error("Class not found or you do not have permission to edit it.");
        }

        // Check if the new class name already exists for the teacher
        const classWithNewName = await prisma.class.findFirst({
            where: {
                name: newName,
                teacherId: teacherId
            }
        });
        if (classWithNewName && classWithNewName.id !== classId) {
            throw new Error("Class with this name already exists.");
        }

        // Update the class name
        const updatedClass = await prisma.class.update({
            where: {
                id: classId,
                teacherId: teacherId
            },
            data: {
                name: newName
            }
        });

        return {
            id: updatedClass.id,
            name: updatedClass.name
        };
    }

    /**
     * Deletes a class for a specific teacher.
     * @param teacherId - The ID of the teacher.
     * @param classId - The ID of the class to delete.
     */
    public async deleteClass(teacherId: number, classId: number): Promise<void> {
        // Check if the class exists and belongs to the teacher
        const existingClass = await prisma.class.findFirst({
            where: {
                id: classId,
                teacherId: teacherId
            }
        });
        if (!existingClass) {
            throw new Error("Class not found or you do not have permission to delete it.");
        }

        // Delete the class
        await prisma.class.delete({
            where: {
                id: classId,
                teacherId: teacherId
            }
        });
    }

}