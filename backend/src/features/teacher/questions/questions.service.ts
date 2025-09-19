// src/services/questions.service.ts
import { Prisma, Question, SubmissionAnswer } from "@prisma/client";
import prisma from "../../../config/db";

export class QuestionService {
    /**
     * Fetch a question by its ID, only if it belongs to one of the teacher's assignments
     * @param teacherId the teacher's user id
     * @param questionId the question id
     */
    public async getQuestionById(
        teacherId: number,
        questionId: number
    ): Promise<Question & { answers: SubmissionAnswer[] }> {
        const question = await prisma.question.findFirst({
            where: {
                id: questionId,
                assignment: {
                    teacherId: teacherId,
                },
            },
            include: {
                answers: true,
            },
        });

        if (!question) {
            throw new Error("Question not found or you do not have access.");
        }

        return question;
    }

    /**
     * Create a new question under an assignment (only if the teacher owns it)
     * Automatically sets the next sequence number.
     * @param teacherId the teacher's user id
     * @param assignmentId the assignment id to attach this question to
     * @param questionText the question prompt
     * @param answerKey the correct answer
     */
    public async createQuestion(
        teacherId: number,
        assignmentId: number,
        questionText: string,
        answerKey?: string
    ): Promise<Question> {
        // verify assignment ownership
        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            select: { teacherId: true },
        });
        if (!assignment || assignment.teacherId !== teacherId) {
            throw new Error("Assignment not found or you do not have access.");
        }

        // compute next sequence
        const maxSeq = await prisma.question.aggregate({
            _max: { sequence: true },
            where: { assignmentId },
        });
        const nextSeq = (maxSeq._max.sequence ?? 0) + 1;

        const newQ = await prisma.question.create({
            data: {
                assignmentId,
                sequence: nextSeq,
                questionText,
                answerKey,
            },
        });

        return newQ;
    }

    /**
     * Update a question's text and/or answer, only if the teacher owns it
     * @param teacherId the teacher's user id
     * @param questionId the question id
     * @param questionText new question text
     * @param answerKey new answer key
     */
    public async updateQuestion(
        teacherId: number,
        questionId: number,
        questionText: string,
        answerKey?: string
    ): Promise<Question> {
        // use updateMany to enforce the teacher constraint
        const { count } = await prisma.question.updateMany({
            where: {
                id: questionId,
                assignment: { teacherId },
            },
            data: {
                questionText,
                answerKey,
            },
        });

        if (count === 0) {
            throw new Error("Question not found or you do not have access.");
        }

        // fetch and return the updated record
        return prisma.question.findUniqueOrThrow({
            where: { id: questionId },
        });
    }

    /**
     * Delete a question, only if the teacher owns it
     * @param teacherId the teacher's user id
     * @param questionId the question id
     */
    public async deleteQuestion(
        teacherId: number,
        questionId: number
    ): Promise<Question> {
        // use deleteMany to enforce the teacher constraint
        const deleted = await prisma.question.deleteMany({
            where: {
                id: questionId,
                assignment: { teacherId },
            },
        });

        if (deleted.count === 0) {
            throw new Error("Question not found or you do not have access.");
        }

        // Prisma's deleteMany does not return the deleted record,
        // so you may want to return something custom or the id:
        return { id: questionId } as Question;
    }

    /**
   * Reorder questions for an assignment.
   * @param teacherId the teacher’s user id
   * @param assignmentId the assignment id
   * @param questionIds array of question IDs in the desired order
   * @returns the updated list of questions
   */
    public async reorderQuestions(
        teacherId: number,
        assignmentId: number,
        questionIds: number[]
    ): Promise<Question[]> {
        // 1) Ownership check
        const assignment = await prisma.assignment.findUnique({
            where: { id: assignmentId },
            select: { teacherId: true },
        });
        if (!assignment || assignment.teacherId !== teacherId) {
            throw new Error("Assignment not found or you do not have access.");
        }
        if (questionIds.length === 0) {
            return [];
        }

        // 2) Build CASE … WHEN fragments
        const cases = Prisma.join(
            questionIds.map((id, idx) =>
                // no quotes around id or sequence
                Prisma.sql`WHEN id = ${id} THEN ${idx + 1}`
            ),
            " "
        );

        // 3) Build IN(...) list
        const inList = Prisma.join(
            questionIds.map((id) => Prisma.sql`${id}`),
            ","
        );

        // 4) One UPDATE in MariaDB/MySQL
        await prisma.$executeRaw`
          UPDATE Question
          SET sequence = CASE ${cases} ELSE sequence END
          WHERE assignmentId = ${assignmentId}
            AND id IN (${inList});
        `;

        // 5) Return them in new sequence order
        return prisma.question.findMany({
            where: { assignmentId },
            orderBy: { sequence: "asc" },
        });
      }
  
}
