import { Router } from "express";
import {
    createNewClass,
    editClass,
    deleteClass,
    getAllClasses,
    getAllClassesData,
    getClassById
} from "./classes.controller";

const router: Router = Router();

// Managing Classes
router.get("/", getAllClasses); // Get all classes

router.get("/all", getAllClassesData); // Get all the classes data (big query)

router.post("/", createNewClass); // Create a new class

router.route("/:classId")
    .get(getClassById) // Get class by ID
    .put(editClass) // Edit class by ID
    .delete(deleteClass); // Delete class by ID

export default router;