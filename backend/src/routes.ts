import { Router } from "express";

import authRouter from "./features/shared/auth/auth.router";
import userRouter from "./features/shared/user/user.router";

import retakeRequestsRouter from "./features/teacher/retakeRequests/retakeRequests.router";
import classesRouter from "./features/teacher/classes/classes.router";
import sectionsRouter from "./features/teacher/sections/sections.router";
import assignmentRouter from "./features/teacher/assignments/assignments.router";
import questionRouter from "./features/teacher/questions/questions.router";
import attemptsRouter from "./features/teacher/attempts/attempts.router";

import { ensureAuthenticated } from "./common/session/session";

const router: Router = Router({ mergeParams: true });

// --------------------------------------------------
// Shared Routes
// --------------------------------------------------

// Authentication Routes
router.use("/auth", authRouter);

router.use("/user", userRouter);

// Notifications Routes

// Managing Classes
router.use("/classes", ensureAuthenticated, classesRouter);

// Managing Sections
router.use("/classes/:classId/sections", ensureAuthenticated, sectionsRouter);

// Managing Assignments
router.use("/classes/:classId/sections/:sectionId/assignments", ensureAuthenticated, assignmentRouter);

// Managing Questions
router.use("/classes/:classId/sections/:sectionId/assignments/:assignmentId/questions", ensureAuthenticated, questionRouter);

// Managing Retake Requests
router.use("/retake-requests", ensureAuthenticated, retakeRequestsRouter);

// Managing Retake Attempts
router.use("/retake-requests/:requestId/attempts", ensureAuthenticated, attemptsRouter);


export default router;