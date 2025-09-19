import { Router } from "express";

import {
    getQuestion,
    createQuestion,
    editQuestion,
    deleteQuestion,
    reorderQuestions
} from "./questions.controller";

const router: Router = Router({ mergeParams: true });

// Questions
router.post("/", createQuestion); // Create for assignment
router.put("/", reorderQuestions);
router.route("/:questionId")
    .get(getQuestion) // Get by ID
    .put(editQuestion) // Edit by ID
    .delete(deleteQuestion); // Delete by ID

export default router;