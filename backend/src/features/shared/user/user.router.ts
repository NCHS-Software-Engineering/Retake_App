import { Router } from "express";

import { getProfile, searchUsers, getTeacherStats } from "./user.controller";

import { ensureAuthenticated } from "../../../common/session/session";

const router: Router = Router();

router.get("/profile", ensureAuthenticated, getProfile);

router.get("/full-profile", ensureAuthenticated, getProfile);

router.get("/search", ensureAuthenticated, searchUsers);

router.get("/stats", ensureAuthenticated, getTeacherStats);

export default router;