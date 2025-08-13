// Entrypoint (read env, connect db, listen)
import "reflect-metadata";

import config from "./config/config";
import prisma from "./config/db"
import app from "./app";

(async function main() {
    try {
        // Connect prisma
        await prisma.$connect();
        console.log("Connected to Database.");

        // Start API
        app.listen(config.port, () => {
            console.log(`API running at http://localhost:${config.port}`)
        })
    } catch(err) {
        console.error("Failed to start: ", err);
        process.exit(1);
    }
})()
