// Express app setup(register middleware + routes)
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";

import routes from "./routes";
import { sessionMiddleware } from "./common/session/session";
import passport from "./config/passport";



const app: Application = express();


// Global middleware
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://retake.redhawks.us",
      ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sessionMiddleware);
app.set("trust proxy", 1); // trust first proxy (Nginx)


// Debug middleware to log cookies and session data
//import cookieParser from "cookie-parser";
//app.use(cookieParser());
/* app.use((req, res, next) => {
    console.log("---- Cookie Debug ----");
    console.log("Raw cookies:", req.headers.cookie);
    console.log("Parsed cookies:", req.cookies);
    console.log("Session ID:", (req as any).sessionID);
    console.log("Session object:", (req as any).session);
    console.log("----------------------");
    next();
  }); */

app.use(passport.initialize());
app.use(passport.session());

// Manage Routes
app.use("/api", routes);

// 404 handler (should be after all other routes)
app.use((req: Request, res: Response, next: NextFunction) => {
    const err = new Error("Not Found");
    (err as any).status = 404;

    return next(err);
});

// Error handler middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err.message);
    res
        .status(typeof err.status === "number" ? err.status : 500)
        .json({ message: err.message || "Server Error" })
});

export default app;