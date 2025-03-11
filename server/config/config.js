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

    clientId: process.env.client_id,
    projectId: process.env.project_id,
    authUri: process.env.auth_uri,
    tokenUri: process.env.token_uri,
    authProvider: process.env.auth_provider_x509_cert_url,
    clientSecret: process.env.client_secret,

    redirectURIs: [
        "http://localhost:8000/auth/google/callback",
        "javascript_origins",
        "http://localhost",
        "http://localhost:8081",
        "https://localhost",
        "http://localhost:8000"
    ],
}