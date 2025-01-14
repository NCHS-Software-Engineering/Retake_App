const express = require("express");
const router = express();

// Teacher Dashboard Controllers
const classesController = require("../controllers/teacherDash/classesController")
const emailController = require("../controllers/teacherDash/emailController");

// Student Dashboard Controllers
const trackerController = require("../controllers/studentDash/trackerController");



module.exports = router;