import { Request, Response, NextFunction } from "express-serve-static-core";
import { RequestStatus } from "@prisma/client";

import { RetakeRequestService } from "./retakeRequests.service";
const retakeRequestService = new RetakeRequestService();

export const getAllRetakeRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.role === "teacher") {
            // (pending, assigned, submitted, graded, resolved)
            const status = typeof req.query.status === "string" ? req.query.status : "all";
            const teacherId = req.user.id;

            res.status(200).json(await retakeRequestService.getRetakes(teacherId, status));
        } else if (req.user.role === "student") {
            const studentId = req.user.id;
            res.status(200).json(await retakeRequestService.getAllStudentRetakeRequests(studentId));
        } else {
            throw new Error("Unknown role");
        }

    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const createRetakeRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.role === "teacher") {
            const { studentId, assignmentId, requestNotes } = req.body;
            res.status(200).json(await retakeRequestService.createRetake(req.user.id, studentId, assignmentId, requestNotes, RequestStatus.assigned));
        } else if (req.user.role === "student") {
            const { teacherId, requestNotes } = req.body;
            const studentId = req.user.id;

            res.status(200).json(await retakeRequestService.applyForRetake(teacherId, studentId, requestNotes, RequestStatus.pending));
        }
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const editRequestNotes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestId = parseInt(req.params.requestId, 10);
        const { notes } = req.body;
        await retakeRequestService.editRequestNotes(requestId, notes);
        res.status(200).json(true);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const editRequestAssignmentId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestId = parseInt(req.params.requestId, 10);
        const { assignmentId, studentId } = req.body;
        await retakeRequestService.editRequestAssignmentId(requestId, assignmentId, studentId);
        res.status(200).json(true);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const resolveRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get the requestId from params
        const requestId = parseInt(req.params.requestId, 10);

        await retakeRequestService.resolveRetake(requestId);

        res.status(200).json(true);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const deleteRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requestId = parseInt(req.params.requestId, 10);
        await retakeRequestService.deleteRetake(requestId);
        res.status(200).json(true);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const deleteSubmission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const submissionId = parseInt(req.params.submissionId, 10);
        await retakeRequestService.deleteSubmission(submissionId);
        res.status(200).json(true);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const searchStudents = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // email query
        const emailQuery = req.query.emailQuery as string;
        const status = req.query.status as string;
        const teacherId = req.user.id;

        const studentRequests = await retakeRequestService.getStudentRequests(teacherId, emailQuery, status);
        res.status(200).json(studentRequests);

    } catch (err) {
        console.error(err);
        next(err);
    }
}