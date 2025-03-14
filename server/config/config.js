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

    google: {
        clientId: process.env.client_id,
        clientSecret: process.env.client_secret,
    }
}