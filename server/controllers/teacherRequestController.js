const pool = require("../config/database");
const { getUsersTokenData } = require("../middleware/jwt");

// Render retake request page
exports.requests = async (req, res) => {
    try {
        const userData = getUsersTokenData(req);

        

        // Fetching retake requests
        //  const [requests] = await pool.query(
        //      `SELECT 
        //          r.userId, 
        //          r.testId
        //       FROM retakeRequests r
        //       JOIN tests t ON r.testId = t.testId
        //       JOIN users u ON r.userId = u.userId
        //       JOIN classes c ON t.classId = c.classId
        //       WHERE t.teacherId = ?`, 
        //      [userData.id]
        //  );

        const [classes] = await pool.query(`
            SELECT classId, className FROM classes WHERE teacherId = ?`,
            [userData.id]);

        const [requests] = await pool.query(`
            SELECT r.userId, r.testId, u.email, c.className, t.testName
            FROM retakeRequests r
            JOIN tests t ON r.testId = t.testId
            JOIN users u ON r.userId = u.userId
            JOIN classes c ON t.classId = c.classId
            WHERE t.teacherId = ?
            `, [userData.id]);
        return res.status(200).render("dash/teacher/requests", { 
            err: false, 
            requests,
            classes,

        });
    } catch (err) {
        console.error(err);
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