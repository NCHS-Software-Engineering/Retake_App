import { Request, Response, NextFunction } from 'express-serve-static-core';

import { ClassService } from './classes.service';

const classService = new ClassService();

export const getAllClasses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;

        const classes = await classService.getAllClasses(teacherId);
        res.status(200).json(classes);
    } catch(err) {
        console.error(err);
        next(err);
    }
};

export const getAllClassesData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;

        const classes = await classService.getAllClassesData(teacherId);
        res.status(200).json(classes);
    } catch (err) {
        console.error(err);
        next(err);
    }
};

export const getClassById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const classId = parseInt(req.params.classId, 10);

        const classData = await classService.getClassContentById(teacherId, classId);
        if (!classData) {
            return next(new Error('Class not found'));
        }

        res.status(200).json(classData);

    } catch(err) {
        console.error(err);
        next(err);
    }
};

export const createNewClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const { name } = req.body;

        if (!name) {
            return next(new Error('Class name is required'));
        }

        const newClass = await classService.createNewClass(teacherId, name);
        res.status(201).json(newClass);
    } catch(err) {
        console.error(err);
        next(err);
    }
};

export const editClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const classId = parseInt(req.params.classId, 10);
        const { name } = req.body;

        if (!name) {
            return next(new Error('Class name is required'));
        }

        const updatedClass = await classService.editClass(teacherId, classId, name);
        if (!updatedClass) {
            return next(new Error('Class not found'));
        }

        res.status(200).json(updatedClass);
    } catch(err) {
        console.error(err);
        next(err);
    }
};

export const deleteClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const classId = parseInt(req.params.classId, 10);

        await classService.deleteClass(teacherId, classId);

        res.status(200).json({ message: 'Class deleted successfully' });
    } catch(err) {
        console.error(err);
        next(err);
    }
};