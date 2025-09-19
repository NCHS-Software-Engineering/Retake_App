import prisma from "../../../config/db";

export class SubmissionAttemptService {
    public async getSubmissionsFromRequestId(requestId: number) {
        return await prisma.submissionAttempt.findMany({
            where: {
                requestId: requestId
            },
            select: {
                id: true,
                score: true,
                feedback: true,
                submittedAt: true
            }
        })
    }

    public async createNewSubmissionAttempt(
        studentId: number,
        requestId: number
    ) {
        return await prisma.$transaction(async (tx) => {
            // 1) Create the attempt
            const attempt = await tx.submissionAttempt.create({
                data: { requestId, studentId },
                select: { id: true },
            });

            // 2) Find assignmentId via the request
            const { assignmentId } = await tx.retakeRequest.findUniqueOrThrow({
                where: { id: requestId },
                select: { assignmentId: true },
            });

            // 3) Load all questions for that assignment
            const questions = await tx.question.findMany({
                where: { assignmentId: assignmentId || 0 },
                orderBy: { sequence: "asc" },
                select: { id: true, sequence: true, questionText: true },
            });

            // 4) Create one blank answer per question
            const createdAnswers = await Promise.all(
                questions.map((q) =>
                    tx.submissionAnswer.create({
                        data: {
                            attemptId: attempt.id,
                            questionId: q.id,
                            answerText: "",
                            isCorrect: false,
                            feedback: "",
                        },
                        select: {
                            id: true,
                            questionId: true,
                            answerText: true,
                            isCorrect: true,
                            feedback: true,
                        },
                    })
                )
            );

            // 5) Merge into the final return shape
            return { id: attempt.id };
        });
    }

    public async getSubmissionFromSubmissionId(submissionId: number) {

        return await prisma.submissionAttempt.findFirst({
            where: { id: submissionId },
            select: {
                id: true,
                submittedAt: true,
                score: true,
                feedback: true,
                request: {
                    select: {
                        id: true,
                        assignment: {
                            select: {
                                id: true,
                                title: true,
                                description: true,
                                type: true,
                            },
                        },
                    },
                },
                student: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        profile: {
                            select: { profilePictureUrl: true },
                        },
                    },
                },
                answers: {
                    orderBy: {
                        question: { sequence: 'asc' },
                    },
                    select: {
                        id: true,
                        answerText: true,
                        isCorrect: true,
                        feedback: true,
                        question: {
                            select: {
                                id: true,
                                sequence: true,
                                questionText: true,
                                answerKey: true,
                            },
                        },
                    },
                },
            },
        })
    }

    public async getSubmissionForStudent(
        submissionId: number
    ) {
        const { request, score, feedback } = await prisma.submissionAttempt.findUniqueOrThrow({
            where: { id: submissionId },
            select: {
                score: true,
                feedback: true,
                request:
                    { select: { assignmentId: true } }
            },
        });
        const assignmentId = request.assignmentId!;

        const questionsWithAnswers = await prisma.question.findMany({
            where: { assignmentId },
            orderBy: { sequence: "asc" },
            select: {
                id: true,
                sequence: true,
                questionText: true,
                answers: {
                    where: { attemptId: submissionId },
                    select: {
                        id: true,
                        answerText: true,
                        isCorrect: true,
                        feedback: true,
                    },
                    take: 1,
                },
            },
        });

        const questions = await Promise.all(
            questionsWithAnswers.map(async (q) => {
            let [ans] = q.answers;
            if (!ans || ans.id == null) {
                // Create a new blank answer for this question
                ans = await prisma.submissionAnswer.create({
                data: {
                    attemptId: submissionId,
                    questionId: q.id,
                    answerText: ""
                },
                select: {
                    id: true,
                    answerText: true,
                    isCorrect: true,
                    feedback: true,
                },
                });
            }
            return {
                id: q.id,
                sequence: q.sequence,
                questionText: q.questionText,
                answer: {
                id: ans.id,
                answerText: ans.answerText,
                isCorrect: ans.isCorrect,
                feedback: ans.feedback,
                },
            };
            })
        );

        return {
            score,
            feedback,
            questions: questions
        };
    }

    public async setQuestionStatus(answerId: number, isCorrect: boolean) {
        await prisma.submissionAnswer.update({
            where: {
                id: answerId
            },
            data: {
                isCorrect: isCorrect
            }
        })
    }

    public async setQuestionFeedback(answerId: number, feedback: string) {
        await prisma.submissionAnswer.update({
            where: {
                id: answerId
            },
            data: {
                feedback: feedback
            }
        })
    }

    public async setAttemptScore(attemptId: number, score: number) {
        await prisma.submissionAttempt.update({
            where: {
                id: attemptId
            },
            data: {
                score: score
            }
        })
    }

    public async setAttemptFeedback(attemptId: number, feedback: string) {
        await prisma.submissionAttempt.update({
            where: {
                id: attemptId
            },
            data: {
                feedback: feedback
            }
        })
    }

    public async finalizeGrade(attemptId: number) {
        await prisma.submissionAttempt.update({
            where: {
                id: attemptId
            },
            data: {
                request: {
                    update: {
                        status: "graded"
                    }
                }
            }
        });
    }

    public async saveAnswerText(answerId: number, answerText: string) {
        await prisma.submissionAnswer.update({
            where: {
                id: answerId
            },
            data: {
                answerText: answerText
            }
        });
    }

    public async submitAttempt(attemptId: number) {
        // Set the attempt as submitted
        await prisma.submissionAttempt.update({
            where: { id: attemptId },
            data: {
                submittedAt: new Date(),
                request: {
                    update: {
                        status: "submitted"
                    }
                }
            },
        });
    }

}