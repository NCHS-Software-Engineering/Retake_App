import { Request, Response, NextFunction } from "express";
import config from "../../../config/config";

// Callback after google calls our callback
export const googleAuthCallback = (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.redirect(`${config.clientUrl}/auth`);
    }
    return res.redirect(`${config.clientUrl}/dashboard`); 
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