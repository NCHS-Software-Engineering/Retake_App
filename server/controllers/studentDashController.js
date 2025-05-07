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
    try {
        // Select the retake requests from the database
        const userData = getUsersTokenData(req);
        if (!userData) {
            return res.status(400).render("pages/auth", { err: "You need to be signed in to view this page" });
        }
        const userId = userData.id;

        // AND questionString != '' | this filters out the requests that are not filled out yet
        const [results] = await pool.query(`
            SELECT r.*, t.testName 
            FROM retakeRequests r 
            JOIN tests t ON r.testId = t.testId 
            WHERE r.userId = ?
        `, [userId]);

        return res.status(200).render("dash/student/fillout", { err: null, requests: results });
        
    } catch (err) {
        console.log(err);
        return res.status(500).render("dash/student/fillout", { err: "An error occurred while processing your request", requests: [] });
    }
}

exports.studentRegisterForRetake = async (req, res) => {
    try {
        const { teacherId, classId, testId } = req.body
        const userData = getUsersTokenData(req);
        if (!userData) {
            return res.status(400).render("pages/auth", { err: "You need to be signed in to view this page" });
        }
        const userId = userData.id;

        // Add a new retake request to the database
        await pool.query("INSERT INTO retakeRequests (userId, testId) VALUES (?, ?)", [userId, testId]);

        return res.status(200).json({ err: false, msg: "Successfully registered for retake" });

    } catch (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ err: "An error occurred while processing your request" });
        }
    }
}

exports.getQuestionString = async (req, res) => {
    try {
        const { requestId } = req.query;
        const userData = getUsersTokenData(req);
        if (!userData) {
            return res.status(400).render("pages/auth", { err: "You need to be signed in to view this page" });
        }
        const userId = userData.id;

        // Get the question string for the test
        const [results] = await pool.query("SELECT questionString FROM retakeRequests WHERE userId = ? AND requestId = ?", [userId, requestId]);
        
        return res.status(200).json({ err: false, questionString: results[0].questionString });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "An error occurred while processing your request" });
    }
}

exports.submitLink = async (req, res) => { 

    try {
        const { requestId, link } = req.body;
        const userData = getUsersTokenData(req);
        if (!userData) {
            return res.status(400).render("pages/auth", { err: "You need to be signed in to view this page" });
        }
        const userId = userData.id;

        // Edit the retakeRequest link with the link provided
        await pool.query("UPDATE retakeRequests SET questionString = ? WHERE userId = ? AND requestId = ?", [link, userId, requestId]);
        return res.status(200).json({ err: false, msg: "Successfully submitted link" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "An error occurred while processing your request" });
    }
}