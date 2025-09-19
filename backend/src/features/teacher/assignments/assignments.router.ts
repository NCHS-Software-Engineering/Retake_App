import { Router } from "express";

import {
    getAssignment,
    createAssignment,
    editAssignment,
    deleteAssignment,
} from "./assignments.controller";

const router: Router = Router({ mergeParams: true });

// Assignment Work
router.post("/", createAssignment); // Create for section
router.route("/:assignmentId")
    .get(getAssignment) // Get  by ID
    .put(editAssignment) // Edit  by ID
    .delete(deleteAssignment); // Delete by ID

export default router;