import { Prisma, RequestStatus } from "@prisma/client";
import prisma from "../../../config/db";

export class RetakeRequestService {
    public async getRetakes(teacherId: number, status: string) {
        let statusFilter: RequestStatus | undefined = undefined;
        let excludeResolved = false;

        if (status && status !== "all") {
            if (Object.values(RequestStatus).includes(status as RequestStatus)) {
                statusFilter = status as RequestStatus;
            }
        } else if (status === "all") {
            excludeResolved = true;
        }

        const whereClause: any = {
            teacherId: teacherId
        };

        if (statusFilter) {
            whereClause.status = statusFilter;
        } else if (excludeResolved) {
            whereClause.status = { not: RequestStatus.resolved };
        }

        return await prisma.retakeRequest.findMany({
            where: whereClause,
            select: {
                id: true,
                studentId: true,
                assignmentId: true,
                requestNotes: true,
                status: true,
                createdAt: true,
                student: {
                    select: {
                        username: true,
                        email: true,
                        profile: {
                            select: {
                                profilePictureUrl: true
                            }
                        }
                    }
                },
                assignment: {
                    select: {
                        title: true
                    }
                }
            }
        });
    }

    public async getAllStudentRetakeRequests(studentId: number) {
        return await prisma.retakeRequest.findMany({
            where: {
                studentId: studentId
            },
            select: {
                id: true,
                assignmentId: true,
                requestNotes: true,
                status: true,
                createdAt: true,
                assignment: {
                    select: {
                        title: true
                    }
                },
                teacher: {
                    select: {
                        username: true,
                        email: true,
                        profile: {
                            select: {
                                profilePictureUrl: true
                            }
                        }
                    }
                },
                attempts: {
                    select: {
                        id: true,
                        submittedAt: true,
                        score: true,
                        feedback: true,
                    }
                }
            }
        });
    }

    public async getStudentRequests(teacherId: number, emailQuery: string, status: string) {
        const isSpecificStatus = !!status && status !== "all";
        const isActiveStatus = !status || status === "all";

        const whereClause: any = {
            student: {
                email: {
                    startsWith: emailQuery || "",
                },
            },
            assignment: {
                teacherId,
            },
          };

        // Apply status filter
        if (isSpecificStatus && Object.values(RequestStatus).includes(status as any)) {
            whereClause.status = status as RequestStatus;
        } else if (isActiveStatus) {
            whereClause.status = { not: RequestStatus.resolved };
        }
        // else: no status key at all (will include *all* statuses)

        const res = await prisma.retakeRequest.findMany({
            where: whereClause,
            select: {
                id: true,
                assignmentId: true,
                requestNotes: true,
                status: true,
                createdAt: true,
                student: {
                    select: {
                        username: true,
                        email: true,
                        profile: { select: { profilePictureUrl: true } },
                    },
                },
                assignment: { select: { title: true } },
            },
        });

        return res;
    }

    public async createRetake(teacherId: number, studentId: number, assignmentId: number, requestNotes: string, status: RequestStatus) {
        return await prisma.retakeRequest.create({
            data: {
                teacherId,
                studentId,
                assignmentId,
                requestNotes,
                status
            },
            select: {
                id: true,
                assignmentId: true,
                requestNotes: true,
                status: true,
                createdAt: true,
                student: {
                    select: {
                        username: true,
                        email: true,
                        profile: { select: { profilePictureUrl: true } },
                    },
                },
                assignment: { select: { title: true } },
            }
        });
    }

    public async applyForRetake(teacherId: number, studentId: number, requestNotes: string, status: RequestStatus) {
        return await prisma.retakeRequest.create({
            data: {
                teacherId,
                studentId,
                requestNotes,
                status
            },
            select: {
                id: true,
                requestNotes: true,
                status: true,
                createdAt: true,
            }
        });
    }


    public async resolveRetake(requestId: number) {
        await prisma.retakeRequest.update({
            where: {
                id: requestId
            },
            data: {
                status: RequestStatus.resolved
            }
        })
    }

    public async deleteRetake(requestId: number) {
        await prisma.retakeRequest.delete({
            where: {
                id: requestId
            }
        })
    }

    public async deleteSubmission(submissionId: number) {
        await prisma.submissionAttempt.delete({
            where: {
                id: submissionId
            }
        })
    }

    public async editRequestNotes(requestId: number, notes: string) {
        await prisma.retakeRequest.update({
            where: {
                id: requestId
            },
            data: {
                requestNotes: notes
            }
        })
    }

    public async editRequestAssignmentId(requestId: number, assignmentId: number, studentId: number) {
        await prisma.retakeRequest.update({
            where: {
                id: requestId
            },
            data: {
                assignmentId: assignmentId,
                status: "assigned"
            }
        })
    }

}