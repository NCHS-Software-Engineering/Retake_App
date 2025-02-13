const pool = require("../config/database");
const { getUsersTokenData } = require("../middleware/jwt");

// Render email page
exports.email = async (req, res) => {

    try {
        const userData = getUsersTokenData(req);
        const [results] = await pool.query(
            `SELECT r.userId, r.testId 
             FROM retakeRequests r
             JOIN tests t ON r.testId = t.testId
             WHERE t.teacherId = ?`, [userData.id]);
        return res.status(200).render("dash/teacher/email", {err: false, requests: results});
    } catch (err) {
        console.log(err);
        return res.status(400).render("dash/teacher/email", {err: "Something went wrong"})
    }

    return res.status(200).render("dash/teacher/email")
}