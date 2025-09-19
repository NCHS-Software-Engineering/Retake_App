import { Router } from "express";

const router: Router = Router({ mergeParams: true });

router.get("/:retake-requests")

export default router;