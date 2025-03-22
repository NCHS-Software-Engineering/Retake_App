const express = require("express");
const router = express();
const pool = require("../config/database");

// Middleware
const { getUsersTokenData } = require("../middleware/jwt");
const { validateStudent, validateTeacher } = require("../middleware/roleValidation");

// Controllers
const teacherClassesController = require("../controllers/teacherClassesController");
const teacherRequestController = require("../controllers/teacherRequestController");
const studentDashController = require("../controllers/studentDashController");
const dashNotificationsController = require("../controllers/dashNotificationsController");

// --------------------------------------------------
// Teacher Routes
// --------------------------------------------------

// Manage Classes
router.get("/classes", validateTeacher, teacherClassesController.classes)
router.post("/saveClass", validateTeacher, teacherClassesController.saveClass)
router.get("/listClasses", validateTeacher, teacherClassesController.listClasses);
router.post("/renameClass", validateTeacher, teacherClassesController.renameClass);
router.delete("/deleteClass", validateTeacher, teacherClassesController.deleteClass);
router.post("/saveTest", validateTeacher, teacherClassesController.saveTest);
router.get("/listTests", validateTeacher, teacherClassesController.listTests);
router.post("/renameTest", validateTeacher, teacherClassesController.renameTest);
router.delete("/deleteTest", validateTeacher, teacherClassesController.deleteTest);
router.get("/listQuestions", validateTeacher, teacherClassesController.listQuestions);
router.post("/updateQuestions", validateTeacher, teacherClassesController.updateQuestions);

// Manage Retake Requests
router.get("/requests", validateTeacher, teacherRequestController.requests)


// --------------------------------------------------
// Student Routes
// --------------------------------------------------

// Track retakes (past/current)
router.get("/tracker", validateStudent, (req, res) => {
    return res.status(200).render("/dash/student/tracker");
})

// --------------------------------------------------
// Both Student and teacher
// --------------------------------------------------

// Render dashboard for both student and teacher diffrently
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

router.get("/manageClasses", teacherClassesController.updateOrder);

module.exports = router;