import { Router } from "express";

import {
    getSubmissionAttempts,
    createNewSubmissionAttempt,
    getSubmission,
    editQuestion,
    editAttempt,
    finalizeAttempt,
    saveAnswerText,
    submitAttempt,
    scoreAttempt
} from "./attempts.controller"

const router: Router = Router({ mergeParams: true });

// GET /[requestId]
//      -> Get submission attempts from retake request requestId
router.get("/", getSubmissionAttempts);

// POST /[requestId]
router.post("/", createNewSubmissionAttempt);

// GET /[requestId]/attempt/[attemptId]
//      -> Get the submission for a submission attempt
router.get("/:attemptId", getSubmission);

// Set question status (true or false) or feedback for a question
router.put("/answer/:answerId", editQuestion);

// Set attempt score or feedback for a question
router.put("/:attemptId", editAttempt);

// Finalize an attempt
router.patch("/:attemptId", finalizeAttempt);

// Score an attempt
router.patch("/:attemptId/score", scoreAttempt);


// Save answer text for a question
router.put("/:attemptId/answer/:answerId", saveAnswerText);

// Submit the attempt
router.post("/:attemptId/submit", submitAttempt);

export default router;