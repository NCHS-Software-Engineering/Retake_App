const pool = require("../config/database");
const { getUsersTokenData } = require("../middleware/jwt");

// Render retake request page
exports.requests = async (req, res) => {
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