const express = require("express");
const router = express();

// Teacher Dashboard Controllers
const teacherDashController = require("../controllers/teacherDashController");

// Student Dashboard Controllers
const studentDashController = require("../controllers/studentDashController");

// --------------------------------------------------
// Teacher Routes
// --------------------------------------------------

// Manage Classes
router.get("/classes", (req, res) => {
    return res.status(200).render("/dash/teacher/manageClasses");
})

// Manage Email
router.get("/email", (req, res) => {
    return res.status(200).render("/dash/teacher/email");
})

// --------------------------------------------------
// Student Routes
// --------------------------------------------------

// Track retakes (past/current)
router.get("/tracker", (req, res) => {
    return res.status(200).render("/dash/student/tracker");
})


module.exports = router;