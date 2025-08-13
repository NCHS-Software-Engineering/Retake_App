import { PrismaClient } from "@prisma/client";

import config from "./config";

// Init client for app
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: config.databaseUrl
        }
    }
})

export default prisma;

// Lifecycle event
// prisma.$on("beforeExit", async () => {
//     await prisma.$disconnect();
// });