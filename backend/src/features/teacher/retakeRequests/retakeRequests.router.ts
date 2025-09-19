import { Router } from "express";

import {
    getAllRetakeRequests,
    createRetakeRequest,
    resolveRequest,
    deleteRequest,
    deleteSubmission,
    editRequestNotes,
    searchStudents,
    editRequestAssignmentId
} from "./retakeRequests.controller"

const router: Router = Router({ mergeParams: true });

// GET /
// GET /?stage=[stage]
//      -> Get all retake requests (pending, assigned, submitted, graded, resolved)
router.get("/", getAllRetakeRequests);

// GET /search
router.get("/search", searchStudents);

// POST /
//      -> Create new retake request
router.post("/", createRetakeRequest);

// PUT / 
//      -> Edits notes of retake request
router.put("/update/notes/:requestId", editRequestNotes)

// PUT / 
//      -> Edits the assignmentId of retake request
router.put("/update/assignment/:requestId", editRequestAssignmentId);

// PATCH /[requestId]
//      -> Set the status of the retake request to resolved
router.patch("/:requestId", resolveRequest);

// DELETE /[requestId]
//      -> Delete request
router.delete("/:requestId", deleteRequest);

// DELETE /submissions/[submissionId]
//      -> Delete submission of retake request
router.delete("/submissions/:submissionId", deleteSubmission);


export default router;