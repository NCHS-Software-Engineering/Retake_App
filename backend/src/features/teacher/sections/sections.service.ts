import prisma from "../../../config/db";

export class SectionsService {

    /**
     * Get a specific section with all the relearning work or test retakes by ID.
     * @param teacherId 
     * @param sectionId 
     */
    public async getSection(teacherId: number, classId: number, sectionId: number) {
        const section = await prisma.section.findFirst({
            where: {
                id: sectionId,
                classId: classId,
                class: {
                    teacherId: teacherId,
                },
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
                // any other section fields you want:
                // description: true,
                assignments: {
                    where: { sectionId: sectionId },
                    select: {
                        id: true,
                        title: true,
                        type: true,
                        description: true,
                        // you can nest more, e.g. questions count:
                        // _count: { select: { questions: true } },
                    },
                },
            },
          });

        if (!section) {
            throw new Error("Section not found or you do not have access.");
        }
        return section;
    }

    /**
     * Create a new section for a specific class.
     * @param teacherId 
     * @param classId 
     * @param sectionName 
     */
    public async createNewSection(teacherId: number, classId: number, sectionName: string) {
        const newSection = await prisma.section.create({
            data: {
                name: sectionName,
                class: {
                    connect: {
                        id: classId,
                        teacherId: teacherId,
                    },
                },
            },
            select: {
                id: true,
                name: true,
                assignments: true,
            },
        });

        return newSection;
    }

    /**
     * Rename a section by ID.
     * @param teacherId 
     * @param sectionId 
     * @param sectionName 
     */
    public async editSection(teacherId: number, sectionId: number, sectionName: string) {
        const updatedSection = await prisma.section.update({
            where: {
                id: sectionId,
                class: {
                    teacherId: teacherId,
                },
            },
            data: {
                name: sectionName,
            },
            select: {
                id: true,
                name: true,
                createdAt: true,
            },
        });

        if (!updatedSection) {
            throw new Error("Section not found or you do not have access.");
        }

        return updatedSection;
    }

    /**
     * Delete a section by ID.
     * @param teacherId 
     * @param sectionId 
     */
    public async deleteSection(teacherId: number, sectionId: number) {
        await prisma.assignment.deleteMany({ where: { sectionId } });
        await prisma.section.deleteMany({
            where: {
                id: sectionId,
                class: {
                    teacherId: teacherId,
                },
            },
        });
    }

}