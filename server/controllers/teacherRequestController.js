const pool = require("../config/database");
const { getUsersTokenData } = require("../middleware/jwt");

exports.createNewStuRequest = async (req, res) => {
    
    try {
        const userData = getUsersTokenData(req);
        const { testId, usersId, questionString } = req.body;
        
        // Insert into retakeRequests table and add in testId and ussersName, and make userId 0
        const [result] = await pool.query(
            `INSERT INTO retakeRequests (userId, testId, questionString) 
            VALUES (?, ?, ?)`,
            [usersId, testId, questionString]
        );

        return res.status(200).json({ err: false, msg: "Added student successfully" });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ err: "Something went wrong", requests: [] });
    }

};

exports.getRequestById = async (req, res) => {
    try {
        const userData = getUsersTokenData(req);
        const  requestId  = req.query.requestId;

        // Fetch the request by ID
        const [request] = await pool.query(`
            SELECT r.testId, r.questionString
            FROM retakeRequests r
            WHERE r.requestId = ?`, [requestId]);

        return res.status(200).json({ err: false, request });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ err: "Something went wrong", request: null });
    }
}

exports.updateQuestion = async (req, res) => {
    try {
        const userData = getUsersTokenData(req);
        const { requestId, questionIds } = req.body;
        const questionString = questionIds.join(","); // Convert the array to a comma-separated string
        // Update the question string in the retakeRequests table
        const [result] = await pool.query(`
            UPDATE retakeRequests 
            SET questionString = ? 
            WHERE requestId = ?`, [questionString, requestId]);

        return res.status(200).json({ err: false, msg: "Updated question successfully" });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ err: "Something went wrong", request: null });
    }
}

exports.getStudentEmailsByLetters = async (req, res) => {
    const { letters } = req.query; // Get the letters from the query string

    try {
        const userData = getUsersTokenData(req);

        // Fetch students based on the letters
        const [students] = await pool.query(`
            SELECT email, userId, username FROM users 
            WHERE email LIKE ? AND type = 'student'`,
            [`${letters}%`]);

            

        return res.status(200).json({ err: false, students });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ err: "Something went wrong", students: [] });
    }
}

exports.requests = async (req, res) =>
    {
        try {
            const userData = getUsersTokenData(req);
    
            const [classes] = await pool.query(`
                SELECT classId, className FROM classes WHERE teacherId = ?`,
                [userData.id,userData.email]);
    
            const [requests] = await pool.query(`
                SELECT  r.userId, r.testId, u.email, c.className, t.testName, r.requestId
                FROM retakeRequests r
                JOIN tests t ON r.testId = t.testId AND t.teacherId = ?
                JOIN users u ON u.userId = r.userId 
                JOIN classes c ON t.classId = c.classId
                `, [userData.id]);
    
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