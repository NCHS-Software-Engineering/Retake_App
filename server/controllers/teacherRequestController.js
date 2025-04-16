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

        const [classes] = await pool.query(`
            SELECT classId, className FROM classes WHERE teacherId = ?`,
            [userData.id]);

        const [requests] = await pool.query(`
            SELECT  r.testId, u.email, c.className, t.testName
            FROM retakeRequests r
            JOIN users u ON u.userId = ?
            JOIN tests t ON r.testId = t.testId
            JOIN classes c ON t.classId = c.classId
            WHERE t.teacherId = ?
            `, [userData.id,userData.id]);

        return res.status(200).render("dash/teacher/requests", { 
            err: false, 
            requests,
            classes,

        });
    } catch (err) {
        console.log(err)
        return res.status(400).render("dash/teacher/requests", { 
            err: "Something went wrong", 
            requests: [], 
            classes: [] 
        });
    }
};

exports.createNewStuRequest = async (req, res) => {

    try {
        const userData = getUsersTokenData(req);
        const { testId, usersName } = req.body;

        // Insert into retakeRequests table and add in testId and usersName, and make userId 0
        const [result] = await pool.query(
            `INSERT INTO retakeRequests (userId, testId, usersName) 
            VALUES (?, ?, ?)`,
            [0, testId, usersName]
        );

        return res.status(200).json({ err: false, msg: "Added student successfully" });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ err: "Something went wrong", requests: [] });
    }

};