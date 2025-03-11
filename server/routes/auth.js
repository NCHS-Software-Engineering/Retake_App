const express = require("express");
const router = express();

// Controllers
const authController = require("../controllers/authController");

router.post("/login", authController.login);

router.post("/google/callback", );

module.exports = router;