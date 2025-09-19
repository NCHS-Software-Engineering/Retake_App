import { Request, Response, NextFunction } from 'express-serve-static-core';
import { AssignmentService } from './assignments.service';
const assignmentService = new AssignmentService();

export const getAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const assignmentId = parseInt(req.params.assignmentId, 10);

        const assignment = await assignmentService.getAssignmentById(teacherId, assignmentId);
        res.status(200).json(assignment);
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

export const createAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const sectionId = parseInt(req.params.sectionId, 10);
        const { type, title, description } = req.body;

        const newAssignment = await assignmentService.createAssignment(
            teacherId,
            sectionId,
            type,
            title,
            description
        );
        res.status(201).json(newAssignment);
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

export const editAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const assignmentId = parseInt(req.params.assignmentId, 10);
        const { title, description } = req.body;

        const updatedAssignment = await assignmentService.updateAssignment(
            teacherId,
            assignmentId,
            title,
            description
        );
        res.status(200).json(updatedAssignment);
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

export const deleteAssignment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const assignmentId = parseInt(req.params.assignmentId, 10);

        const deletedAssignment = await assignmentService.deleteAssignment(teacherId, assignmentId);
        res.status(200).json(deletedAssignment);
    } catch (err) {
        console.error(err);
        return next(err);
    }
};