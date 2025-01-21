const express = require("express");
const router = express();

// Controllers
const teacherDashController = require("../controllers/teacherDashController");
const studentDashController = require("../controllers/studentDashController");
const { validateStudent, validateTeacher } = require("../middleware/roleValidation");
const { getUsersTokenData } = require("../middleware/jwt");
const pool = require("../config/database");


router.get("/", async (req, res) => {
    const userData = getUsersTokenData(req);

    if (!userData) {
        return res.status(400).render("pages/auth", { err: "You need to be signed in to view this page" });
    }

    try {
        const userType = userData.type;

        if (!userType) {
            res.clearCookie('access-token');
            return res.status(401).render("pages/auth", { err: "You need to be signed in to view this page" });
        }

        if (userType === "student") {
            return res.status(200).render("dash/student/dash");
        } else if (userType === "teacher") {
            return res.status(200).render("dash/teacher/dash")
        }

        return res.status(400).render("pages/auth", { err: "Could not provide a dashboard for your user type" });
    } catch (err) {
        console.error("Error fetching user data:", err);
        return res.status(500).render("pages/auth", { err: "An error occurred while processing your request" });
    }
});


// --------------------------------------------------
// Teacher Routes
// --------------------------------------------------

// Manage Classes
router.get("/classes", validateTeacher, async (req, res) => {
    try {
        const userData = getUsersTokenData(req);

        const [results] = await pool.query("SELECT classId, className FROM classes WHERE teacherId = ?", [userData.id]);
        return res.status(200).render("dash/teacher/manageClasses", { err: false, classes: results });

    } catch (err) {
        return res.status(400).render("dash/teacher/manageClasses", { err: "Something went wrong with rendering page" });

    }

})

router.get("/instructions", validateTeacher, (req, res) => {
    return res.status(200).render("dash/teacher/instructions");
})

// Manage Email
router.get("/email", validateTeacher, (req, res) => {
    return res.status(200).render("dash/teacher/email");
})

// Save Classes for teacher
router.post("/saveClass", validateTeacher, teacherDashController.saveClass)

// --------------------------------------------------
// Student Routes
// --------------------------------------------------

// Track retakes (past/current)
router.get("/tracker", validateStudent, (req, res) => {
    return res.status(200).render("/dash/student/tracker");
})


module.exports = router;