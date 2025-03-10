const dotenv = require("dotenv");
dotenv.config({path: ".env"});

module.exports = {
    db: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    },
    passHashToken: process.env.PASS_HASH_TOKEN,
    jwtToken: process.env.JWT_TOKEN,
    clientId: process.env,
    redirectURIs: ["http://localhost:8000/auth/google/callback",
    "javascript_origins",
    "http://localhost",
    "http://localhost:8081",
    "https://localhost",
    "http://localhost:8000"],
}