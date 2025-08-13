import { Request, Response, NextFunction } from 'express-serve-static-core';
import { SectionsService } from './sections.service';

const sectionsService = new SectionsService();

export const getSection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const classId = parseInt(req.params.classId, 10);
        const sectionId = parseInt(req.params.sectionId, 10);

        const section = await sectionsService.getSection(teacherId, classId, sectionId);
        if (!section) {
            return next(new Error('Section not found'));
        }

        res.status(200).json(section);
    } catch (err) {
        console.error(err);
        return next(new Error('Failed to retrieve section'));
    }
};

export const createNewSection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const classId = parseInt(req.params.classId, 10);
        const { sectionName } = req.body;

        if (!sectionName) {
            return next(new Error('Section name is required'));
        }

        const newSection = await sectionsService.createNewSection(teacherId, classId, sectionName);
        res.status(201).json(newSection);
    } catch (err) {
        console.error(err);
        return next(new Error('Failed to create section'));
    }
};

export const editSection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const sectionId = parseInt(req.params.sectionId, 10);
        const { sectionName } = req.body;

        if (!sectionName) {
            return next(new Error('Section name is required'));
        }

        const updatedSection = await sectionsService.editSection(teacherId, sectionId, sectionName);
        if (!updatedSection) {
            return next(new Error('Section not found'));
        }

        res.status(200).json(updatedSection);
    } catch (err) {
        console.error(err);
        return next(new Error('Failed to edit section'));
    }
};

export const deleteSection = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const sectionId = parseInt(req.params.sectionId, 10);

        await sectionsService.deleteSection(teacherId, sectionId);
        res.status(204).json({ message: 'Section deleted successfully' });
    } catch (err) {
        console.error(err);
        return next(new Error('Failed to delete section'));
    }
};
