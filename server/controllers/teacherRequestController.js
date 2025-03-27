const pool = require("../config/database");
const { getUsersTokenData } = require("../middleware/jwt");

// Render retake request page
exports.requests = async (req, res) => {

    // <%=request.email%>, Class: <%= request.className %>, Test: <%= request.testName %>

    return res.status(200).render("dash/teacher/requests", { err: false, requests: [

        {
            email: "mitch1@example.com",
            className: "Mitch's Class 101",
            testName: "Mitch's Test 1"
        },
        {
            email: "mitch2@example.com",
            className: "Mitch's Advanced Class",
            testName: "Mitch's Final Exam"
        },
        {
            email: "mitch3@example.com",
            className: "Mitch's Beginner Class",
            testName: "Mitch's Quiz 1"
        },
        {
            email: "mitch4@example.com",
            className: "Mitch's Intermediate Class",
            testName: "Mitch's Midterm"
        },
        {
            email: "mitch5@example.com",
            className: "Mitch's Expert Class",
            testName: "Mitch's Comprehensive Test"
        },
        {
            email: "mitch6@example.com",
            className: "Mitch's Science Class",
            testName: "Mitch's Lab Test"
        },
        {
            email: "mitch7@example.com",
            className: "Mitch's Math Class",
            testName: "Mitch's Algebra Exam"
        },
        {
            email: "mitch8@example.com",
            className: "Mitch's History Class",
            testName: "Mitch's History Quiz"
        },
        {
            email: "mitch9@example.com",
            className: "Mitch's Literature Class",
            testName: "Mitch's Poetry Test"
        },
        {
            email: "mitch10@example.com",
            className: "Mitch's Art Class",
            testName: "Mitch's Drawing Exam"
        }

    ] });

    try {
        const userData = getUsersTokenData(req);
        const [results] = await pool.query(
            `SELECT 
                r.userId, u.email, 
                r.testId, t.testName, 
                t.classId, c.className
             FROM retakeRequests r
             JOIN tests t ON r.testId = t.testId
             JOIN users u ON r.userId = u.userId
             JOIN classes c ON t.classId = c.classId
             WHERE t.teacherId = ?`, 
            [userData.id]
        );

        console.log(results);
        
        return res.status(200).render("dash/teacher/requests", {err: false, requests: results});
    } catch (err) {
        console.log(err);
        return res.status(400).render("dash/teacher/requests", {err: "Something went wrong"})
    }
}