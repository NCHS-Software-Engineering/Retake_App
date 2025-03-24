const express = require("express");
const router = express.Router();

// notification controller
const notificationController = require("../controllers/notificationController");

// Get the notifications
router.get("/list", notificationController.list);

// Delete a notification
router.delete("/remove", notificationController.remove)

module.exports = router;