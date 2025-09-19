import prisma from "../../../config/db";

export class AssignmentService {

    /**
     * Get a specific assignment by its ID and the teacher's ID
     * @param teacherId The ID of the teacher
     * @param assignmentId The ID of the assignment
     * @returns The assignment object
     */
    public async getAssignmentById(teacherId: number, assignmentId: number) {
        const assignment = await prisma.assignment.findFirst({
            where: {
                id: assignmentId,
                teacherId: teacherId,
            },
            select: {
                type: true,
                title: true,
                description: true,
                questions: true,
            }
        });

        if (!assignment) {
            throw new Error("Assignment not found or you do not have access.");
        }

        return assignment;
    }

    /**
     * Create a new assignment for a specific section
     * @param teacherId The ID of the teacher creating the assignment
     * @param sectionId The ID of the section for the assignment
     * @param type The type of the assignment
     * @param title The title of the assignment
     * @param description The description of the assignment
     * @returns The created assignment object
     */
    public async createAssignment(
        teacherId: number,
        sectionId: number,
        type: import("@prisma/client").AssignmentType,
        title: string,
        description: string
    ) {
        const newAssignment = await prisma.assignment.create({
            data: {
                title: title,
                description: description,
                sectionId: sectionId,
                teacherId: teacherId,
                type: type,
            },
            select: {
            type: true,
            title: true,
            description: true,
            questions: true,
        }
        });

        return newAssignment;
    }

    /**
     * Updates an assignment with the given ID and teacher ID by changing its title and description.
     * @param teacherId The ID of the teacher
     * @param assignmentId The ID of the assignment
     * @param title The new title of the assignment
     * @param description The new description of the assignment
     * @returns The updated assignment object
     */
    public async updateAssignment(teacherId: number, assignmentId: number, title: string, description: string) {
        const updatedAssignment = await prisma.assignment.update({
            where: {
                id: assignmentId,
                teacherId: teacherId,
            },
            data: {
                title: title,
                description: description,
            },
            select: {
                type: true,
                title: true,
                description: true,
                questions: true,
            }
        });

        return updatedAssignment;
    }

    /**
     * Deletes an assignment with the given ID and teacher ID.
     * @param teacherId The ID of the teacher
     * @param assignmentId The ID of the assignment
     * @returns The deleted assignment object
     */
    public async deleteAssignment(teacherId: number, assignmentId: number) {
        const deletedAssignment = await prisma.assignment.delete({
            where: {
                id: assignmentId,
                teacherId: teacherId,
            }
        });

        if (!deletedAssignment) {
            throw new Error("Assignment not found or you do not have access.");
        }

        return deletedAssignment;
    }
    
}