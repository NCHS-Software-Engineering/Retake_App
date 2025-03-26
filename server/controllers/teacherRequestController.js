const pool = require("../config/database");
const { getUsersTokenData } = require("../middleware/jwt");

// Render retake request page
exports.requests = async (req, res) => {
    try {
        const userData = getUsersTokenData(req);
        const requestss = [
            { "email": "test", "className": "sigma", "testId": "12221" }
        ]
        
        return res.status(200).render("dash/teacher/requests", { 
            err: false, 
            requestss,
            questions: []
        });


        // Fetching retake requests
        const [requests] = await pool.query(
            `SELECT 
                r.userId, u.googleToken, 
                r.testId, t.testName, 
                t.classId, c.className
             FROM retakeRequests r
             JOIN tests t ON r.testId = t.testId
             JOIN users u ON r.userId = u.userId
             JOIN classes c ON t.classId = c.classId
             WHERE t.teacherId = ?`, 
            [userData.id]
        );

        // needs rewritng
        const [questions] = await pool.query(
            `SELECT q.questionId, q.question, q.classId
             FROM questions q
             JOIN classes c ON q.classId = c.classId
             WHERE c.teacherId = ?`,
            [userData.id]
        );

        console.log({ requests, questions });

        return res.status(200).render("dash/teacher/requests", { 
            err: false, 
            requests, 
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