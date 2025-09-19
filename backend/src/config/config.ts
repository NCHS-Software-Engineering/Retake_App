import dotenv from "dotenv";
import path from "path";

// Load .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") })

const isProd = process.env.NODE_ENV === "production";

// Get values from .env
const config = {
    databaseUrl: process.env.DATABASE_URL,
    port: Number(process.env.PORT || "8080"),
    sessionSecret: process.env.SESSION_SECRET,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleCallbackUrl: isProd
    ? "https://retake.redhawks.us/api/auth/google/callback"
    : "http://localhost:8080/api/auth/google/callback",
    clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
}

// Simple checks
for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
        console.error(`Config error: ${key} is undefined`);
        process.exit(1);
    }
}

export default config;