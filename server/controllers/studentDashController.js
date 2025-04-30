/*
This is the tracker dash for student, not working on yet but features will be:
- Students able to see classes they are doing retakes for
- Ongoing retakes
- Previous retake scores?
*/

const { getUsersTokenData } = require("../middleware/jwt");
const pool = require("../config/database");

exports.request = async (req, res) => {
    // Get a list of teachers to render from db
    const [results] = await pool.query("SELECT username, userId FROM users WHERE type = 'teacher'");

    // Render the page for student to request a retake
    return res.status(200).render("dash/student/request", { err: null, success: null, teachers: results });
}

exports.fillout = async (req, res) => {

}

exports.studentRegisterForRetake = async (req, res) => {
    try {
        const { teacherId, classId, testId } = req.body
        const userData = getUsersTokenData(req);
        if (!userData) {
            return res.status(400).render("pages/auth", { err: "You need to be signed in to view this page" });
        }
        const userId = userData.id;

        console.log(teacherId, classId, testId, userId);
        // Add a new retake request to the database
        await pool.query("INSERT INTO retakeRequests (userId, testId, usersName, questionString) VALUES (?, ?, ?, ?)", [userId, testId, "", ""]);

        return res.status(200).json({err: false, msg: "Successfully registered for retake"});

    } catch(err) {
        if(err) {
            console.log(err);
            return res.status(500).json({err: "An error occurred while processing your request"});
        }
    }
}