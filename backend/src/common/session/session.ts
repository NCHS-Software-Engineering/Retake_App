import session from "express-session"
import { Request, Response, NextFunction } from "express"

import config from "../../config/config"

import path from "path";
import FileStoreFactory from 'session-file-store';
const FileStore = FileStoreFactory(session); // Testing

export const sessionMiddleware = session({
    // Testing
    // store: new FileStore({
    //     path: path.join(__dirname, "sessions"),
    //     ttl: 3600 // 1 hour
    // }),

    

    secret: config.sessionSecret as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        domain: process.env.NODE_ENV === "production" ? ".retake.redhawks.us" : undefined,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
})

// Protect routes
export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    }
    return next(new Error("Unauthorized"));
}