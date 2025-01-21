const pool = require("../config/database");
const { getUsersTokenData } = require("../middleware/jwt");

// Save Class to DB
exports.saveClass = async (req, res) => {
    const className = req.body.className;

    if (typeof className !== "string") {
        return res.status(400).json({ err: "Class Name needs to be a string" });
    }

    if (className.length > 100 || className.length < 3) {
        return res.status(400).json({ err: "Class name needs to be between 3 and 100 characters" });
    }

    try {

        const teacherData = getUsersTokenData(req);
        if (!teacherData) {
            return res.status(400).json({ err: "Could not load data correctly" })
        }

        const [insertResult] = await pool.query(
            'INSERT INTO classes (className, teacherId) VALUES (?, ?)',
            [className, teacherData.id]
        );
        
        res.status(200).json({ err: false, msg: 'Class saved successfully!', classId: insertResult.insertId });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "Error with saving your class, Try again later." });
    }

}

// Save Test to DB
exports.saveTest = async (req, res) => {
    const testName = req.body.testName;
    const classId = req.body.classId;

    if (typeof classId !== "number" || typeof testName !== "string") {
        return res.status(400).json({ err: "Class Name needs to be a string and classId needs to be a number" });
    }

    if (testName.length > 500 || testName.length < 3) {
        return res.status(400).json({ err: "Test Name name needs to be between 3 and 500 characters" });
    }

    try {
        const teacherData = getUsersTokenData(req);
        if (!teacherData) {
            return res.status(400).json({ err: "Could not load data correctly" })
        }

        await pool.promise().query('INSERT INTO tests (testName, teacherId, classId) VALUES (?, ?, ?)', [testName, teacherData.id, classId]);
        res.status(200).json({ err: false, msg: 'Test saved successfully!' });

    } catch (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ err: "Error with saving your test, Try again later." });
        }
    }

}

/*
Handle Emails
This handles all the logic to setup/handle the email process for all the teacher email logic
/dash/email, it will handle all the logic for emails
*/