const express = require("express");
const router = express();

// Controllers
const teacherClassesController = require("../controllers/teacherClassesController");
const teacherEmailController = require("../controllers/teacherEmailController");

const studentDashController = require("../controllers/studentDashController");

const { validateStudent, validateTeacher } = require("../middleware/roleValidation");
const { getUsersTokenData } = require("../middleware/jwt");
const pool = require("../config/database");

// --------------------------------------------------
// Teacher Routes
// --------------------------------------------------

// Dashboard
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

// Email
router.get("/email", validateTeacher, teacherEmailController.email)

// --------------------------------------------------
// Student Routes
// --------------------------------------------------

// Track retakes (past/current)
router.get("/tracker", validateStudent, (req, res) => {
    return res.status(200).render("/dash/student/tracker");
})

// --------------------------------------------------
// Send dash to student or teacher
// --------------------------------------------------
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