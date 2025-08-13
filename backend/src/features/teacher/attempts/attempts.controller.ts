import { Request, Response, NextFunction } from "express-serve-static-core";

import { SubmissionAttemptService } from "./attempts.service";
const submissionAttemptService = new SubmissionAttemptService();

export const getSubmissionAttempts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get requestId from params
        const requestId = parseInt(req.params.requestId, 10);

        res.status(200).json(await submissionAttemptService.getSubmissionsFromRequestId(requestId));

    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const createNewSubmissionAttempt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // requestId from params
        const requestId = parseInt(req.params.requestId, 10);

        res.status(201).json(await submissionAttemptService.createNewSubmissionAttempt(req.user.id, requestId));

    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const getSubmission = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.role === "teacher") {
            // requestId, submissionId from params
            const submissionId = parseInt(req.params.attemptId, 10);

            res.status(200).json(await submissionAttemptService.getSubmissionFromSubmissionId(submissionId));
        } else if (req.user.role === "student") {
            // requestId, submissionId from params
            const submissionId = parseInt(req.params.attemptId, 10);

            res.status(200).json(await submissionAttemptService.getSubmissionForStudent(submissionId));
        } else {
            throw new Error("You are not allowed to view this submission.");
        }

    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const editQuestion = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const answerId = parseInt(req.params.answerId, 10);

        const { isCorrect, feedback } = req.body;

        if (isCorrect !== undefined && typeof isCorrect === "boolean") {
            await submissionAttemptService.setQuestionStatus(answerId, isCorrect);
        } else if (feedback !== undefined && typeof feedback === "string") {
            await submissionAttemptService.setQuestionFeedback(answerId, feedback);
        } else {
            throw new Error("To edit question answer, you need to pick edit something.");
        }

        res.status(200).json(true);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const editAttempt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attemptId = parseInt(req.params.attemptId, 10);

        const { score, feedback } = req.body;
        if (score !== undefined && typeof score === "number") {
            await submissionAttemptService.setAttemptScore(attemptId, score);
        } else if (feedback !== undefined && typeof feedback === "string") {
            await submissionAttemptService.setAttemptFeedback(attemptId, feedback);
        } else {
            throw new Error("To edit submission attempt, you need to edit something.");
        }

        res.status(200).json(true);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const finalizeAttempt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attemptId = parseInt(req.params.attemptId, 10);
        await submissionAttemptService.finalizeGrade(attemptId);
        res.status(200).json(true);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const saveAnswerText = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const answerId = parseInt(req.params.answerId, 10);
        const { answerText } = req.body;

        if (typeof answerText !== "string") {
            throw new Error("Answer text must be a string.");
        }

        await submissionAttemptService.saveAnswerText(answerId, answerText);

        res.status(200).json(true);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const submitAttempt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attemptId = parseInt(req.params.attemptId, 10);
        await submissionAttemptService.submitAttempt(attemptId);
        res.status(200).json(true);
    } catch (err) {
        console.error(err);
        next(err);
    }
}

export const scoreAttempt = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const attemptId = parseInt(req.params.attemptId, 10);
        const { score } = req.body;

        if (typeof score !== "number") {
            throw new Error("Score must be a number.");
        }

        await submissionAttemptService.setAttemptScore(attemptId, score);
        res.status(200).json(true);
    } catch (err) {
        console.error(err);
        next(err);
    }
}