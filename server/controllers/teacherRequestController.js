const pool = require("../config/database");
const { getUsersTokenData } = require("../middleware/jwt");

// Render retake request page
exports.requests = async (req, res) => {
    try {const userData = getUsersTokenData(req);

        

        // Fetching retake requests
        // const [requests] = await pool.query(
        //     `SELECT 
        //         r.userId, u.googleToken, 
        //         r.testId, t.testName, 
        //         t.classId, c.className
        //      FROM retakeRequests r
        //      JOIN tests t ON r.testId = t.testId
        //      JOIN users u ON r.userId = u.userId
        //      JOIN classes c ON t.classId = c.classId
        //      WHERE t.teacherId = ?`, 
        //     [userData.id]
        // );

        // needs rewritng
        const [questions] = await pool.query(
            `SELECT q.questionId, q.question, q.testId
             FROM questions q
             JOIN tests t ON t.testId = t.testId
             WHERE t.teacherId = ?`,
            [userData.id]
        );
        const [classes] = await pool.query(
            `SELECT c.classId, c.className, c.teacherId
             FROM classes c
             JOIN tests t ON t.testId = t.testId
             WHERE t.teacherId = ?`,
            [userData.id]
        );

        return res.status(200).render("dash/teacher/requests", { 
            err: false, 
            requests: [

                {
                    email: "mitch1@example.com",
                    className: "Mitch's Class 101",
                    testName: "Mitch's Test 1",
                    testId: "Mitch's Test 1"
                },
                {
                    email: "mitch2@example.com",
                    className: "Mitch's Advanced Class",
                    testName: "Mitch's Final Exam",
                    testId: "Mitch's Test 1"
                },
                {
                    email: "mitch3@example.com",
                    className: "Mitch's Beginner Class",
                    testName: "Mitch's Quiz 1",
                    testId: "Mitch's Test 1"
                },
                {
                    email: "mitch4@example.com",
                    className: "Mitch's Intermediate Class",
                    testName: "Mitch's Midterm",
                    testId: "Mitch's Test 1"
                },
                {
                    email: "mitch5@example.com",
                    className: "Mitch's Expert Class",
                    testName: "Mitch's Comprehensive Test",
                    testId: "Mitch's Test 1"
                },
                {
                    email: "mitch6@example.com",
                    className: "Mitch's Science Class",
                    testName: "Mitch's Lab Test",
                    testId: "Mitch's Test 1"
                },
                {
                    email: "mitch7@example.com",
                    className: "Mitch's Math Class",
                    testName: "Mitch's Algebra Exam",
                    testId: "Mitch's Test 1"
                },
                {
                    email: "mitch8@example.com",
                    className: "Mitch's History Class",
                    testName: "Mitch's History Quiz",
                    testId: "Mitch's Test 1"
                },
                {
                    email: "mitch9@example.com",
                    className: "Mitch's Literature Class",
                    testName: "Mitch's Poetry Test",
                    testId: "Mitch's Test 1"
                },
                {
                    email: "mitch10@example.com",
                    className: "Mitch's Art Class",
                    testName: "Mitch's Drawing Exam",
                    testId: 59
                }
        
            ], 
            questions 
        });
    } catch (err) {
        console.error(err);
        return res.status(400).render("dash/teacher/requests", { 
            err: "Something went wrong", 
            requests: [], 
            questions: [] 
        });
    }
};