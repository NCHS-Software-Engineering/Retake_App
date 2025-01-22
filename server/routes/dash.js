const express = require("express");
const router = express();

// Controllers
const teacherDashController = require("../controllers/teacherDashController");
const studentDashController = require("../controllers/studentDashController");
const { validateStudent, validateTeacher } = require("../middleware/roleValidation");
const { getUsersTokenData } = require("../middleware/jwt");
const pool = require("../config/database");

// --------------------------------------------------
// Teacher Routes
// --------------------------------------------------

// Return manage classes page, send classes to frontend by defualt
router.get("/classes", validateTeacher, teacherDashController.classes)

// Return instructions page
router.get("/instructions", validateTeacher, (req, res) => {
    return res.status(200).render("dash/teacher/instructions");
})

// return manage email page
router.get("/email", validateTeacher, (req, res) => {
    return res.status(200).render("dash/teacher/email");
})

// Route to save a class for a teacher
router.post("/saveClass", validateTeacher, teacherDashController.saveClass)

// Route to list all classes for a teacher
router.get("/listClasses", validateTeacher, teacherDashController.listClasses);

// Route to rename a class for a teacher
router.post("/renameClass", validateTeacher, teacherDashController.renameClass);

// Route to delete class for a teacher with all tests tied to it with all questions tied to it
router.delete("/deleteClass", validateTeacher, teacherDashController.deleteClass);

// Route to save test for a teacher
router.post("/saveTest", validateTeacher, teacherDashController.saveTest);

// Route to list all tests for a teacher
router.get("/listTests", validateTeacher, teacherDashController.listTests);

// Route to rename test for a teacher
router.post("/renameTest", validateTeacher, teacherDashController.renameTest);

// Route to delete test for a teacher with all questions tied to it
router.delete("/deleteTest", validateTeacher, teacherDashController.deleteTest);

// --------------------------------------------------
// Student Routes
// --------------------------------------------------

// Track retakes (past/current)
router.get("/tracker", validateStudent, (req, res) => {
    return res.status(200).render("/dash/student/tracker");
})

// Determine if its a student or teacher and what dash to render for them
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


module.exports = router;