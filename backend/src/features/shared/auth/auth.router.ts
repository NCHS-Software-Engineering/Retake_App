import { Router } from "express";
import passport from "../../../config/passport";
import { googleAuthCallback, logout } from "./auth.controller";

import { ensureAuthenticated } from "../../../common/session/session";

const router: Router = Router();

// Google Auth and Failure
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "http://localhost:8080/api/auth/failure", session: true }), googleAuthCallback);
router.get("/failure", (_req, res) => {res.status(401).json({ message: "Authentication Failed" })});

// Logout
router.post("/logout", ensureAuthenticated, logout);

export default router;