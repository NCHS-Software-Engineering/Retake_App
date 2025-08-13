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
        secure: false,
        httpOnly: true,
        sameSite: "lax",
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