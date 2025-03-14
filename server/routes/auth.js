const express = require("express");
const router = express();

// Controllers
const authController = require("../controllers/authController");

router.get("/google/callback", authController.googleCallback);

module.exports = router;