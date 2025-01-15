const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config({path: ".env"});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
})

module.exports = db;