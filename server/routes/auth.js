const express = require("express");
const router = express();

// Controllers
const authController = require("../controllers/authController");

router.post("/login", authController.login)

module.exports = router;