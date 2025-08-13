import { RequestStatus } from "@prisma/client";
import prisma from "../../../config/db";
import { Request, Response, NextFunction } from "express";

// Get the user profile
export const getProfile = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next("Not authenticated");
        }

        res.json({
            user: {
                id: req.user.id,
                email: req.user.email,
                username: req.user.username,
                role: req.user.role,
                picture: (req.user as any).profile.profilePictureUrl
            }
        })

    } catch (err) {
        return next(new Error("Failed to get profile"));
    }
}

// Search user based on opposite role
export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.role === "teacher") {
            const emailQuery = req.query.emailQuery as string;

            const users = await prisma.user.findMany({
                where: {
                    role: "student",
                    email: {
                        startsWith: emailQuery
                    }
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    profile: {
                        select: {
                            profilePictureUrl: true
                        }
                    }
                }
            });

            res.json(users);
        } else if(req.user.role === "student") {
            const emailQuery = req.query.emailQuery as string;

            const users = await prisma.user.findMany({
                where: {
                    role: "teacher",
                    email: {
                        startsWith: emailQuery
                    }
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    profile: {
                        select: {
                            profilePictureUrl: true
                        }
                    }
                }
            });

            res.json(users);
        } else {
            return next(new Error("Unknown role"));
        }

    } catch (err) {
        return next(new Error("Failed to search for users"));
    }
}

export const getTeacherStats = async (req: Request, res: Response, next: NextFunction) => {

    try {
        if (req.user.role !== "teacher") {
            return next(new Error("Only teachers can access this route"));
        }

        // Get the classesCount, pendingRequestsCount, and resolvedRequestsCount
        const classesCount = await prisma.class.count({
            where: {
                teacherId: req.user.id
            }
        });

        const pendingRequestsCount = await prisma.retakeRequest.count({
            where: {
                teacherId: req.user.id,
                status: RequestStatus.pending
            }
        });

        const resolvedRequestsCount = await prisma.retakeRequest.count({
            where: {
                teacherId: req.user.id,
                status: RequestStatus.resolved
            }
        });

        res.status(200).json({
            classesCount,
            pendingRequestsCount,
            resolvedRequestsCount
        })
    } catch (err) {
        return next(new Error("Failed to get teacher stats"));
    }

}