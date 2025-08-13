import { Request, Response, NextFunction } from "express";
import passport from "../../../config/passport";

// Callback after google calls our callback
export const googleAuthCallback = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        res.redirect("http://localhost:3000/auth");
    }

    res.redirect("http://localhost:3000");
};

// Log the user out
export const logout = (req: Request, res: Response, next: NextFunction) => {
    try {
        req.logout((err) => {
            if (err) next(err);
            res.json({ message: "Logged out successfully." })
        });
    } catch(err) {
        return next(new Error("Logout failed"));
    }
};