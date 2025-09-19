import { Request, Response, NextFunction } from 'express-serve-static-core';
import { QuestionService } from './questions.service';
const questionService = new QuestionService();

export const getQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const questionId = parseInt(req.params.questionId, 10);

        const question = await questionService.getQuestionById(teacherId, questionId);
        res.status(200).json(question);
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

export const createQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const assignmentId = parseInt(req.params.assignmentId, 10);
        const { question, answer } = req.body;

        const newQuestion = await questionService.createQuestion(
            teacherId,
            assignmentId,
            question,
            answer
        );
        res.status(201).json(newQuestion);
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

export const reorderQuestions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const teacherId = req.user.id;
        const assignmentId = parseInt(req.params.assignmentId, 10);
        const newOrder: number[] = req.body.questionIds;

        const reordered = await questionService.reorderQuestions(
            teacherId,
            assignmentId,
            newOrder
        );
        res.status(200).json(reordered);
    } catch (err) {
        console.error(err);
        next(err);
    }
  };

export const editQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const questionId = parseInt(req.params.questionId, 10);
        const { question, answer } = req.body;

        const updatedQuestion = await questionService.updateQuestion(
            teacherId,
            questionId,
            question,
            answer
        );
        res.status(200).json(updatedQuestion);
    } catch (err) {
        console.error(err);
        return next(err);
    }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const teacherId = req.user.id;
        const questionId = parseInt(req.params.questionId, 10);

        const deletedQuestion = await questionService.deleteQuestion(teacherId, questionId);
        res.status(200).json(deletedQuestion);
    } catch (err) {
        console.error(err);
        return next(err);
    }
};