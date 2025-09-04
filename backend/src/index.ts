import "reflect-metadata";
import config from "./config/config";
import prisma from "./config/db";
import app from "./app";

(async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to Database.");

    app.listen(config.port, () => {
      console.log(`Backend API running at http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("Failed to start backend: ", err);
    process.exit(1);
  }
})();