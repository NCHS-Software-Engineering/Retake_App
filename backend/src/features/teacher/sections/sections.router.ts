import { Router } from "express";

import {
    getSection,
    createNewSection,
    editSection,
    deleteSection,
} from "./sections.controller";

const router: Router = Router({ mergeParams: true });

// Sections
router.post("/", createNewSection); // Create new section
router.route("/:sectionId")
    .get(getSection) // Get section by ID
    .put(editSection) // Edit section by ID
    .delete(deleteSection); // Delete section by ID

export default router;