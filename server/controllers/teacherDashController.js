const pool = require("../config/database");
const { getUsersTokenData } = require("../middleware/jwt");

// Render classes page
exports.classes = async (req, res) => {
    try {
        const userData = getUsersTokenData(req);
        const [results] = await pool.query("SELECT classId, className FROM classes WHERE teacherId = ? ORDER BY className ASC", [userData.id]);
        return res.status(200).render("dash/teacher/manageClasses", { err: false, classes: results });
    } catch (err) {
        return res.status(400).render("dash/teacher/manageClasses", { err: "Something went wrong with rendering page" });
    }
}

// Save teacher class to DB
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
// List teachers classes 
exports.listClasses = async (req, res) => {
    try {
        const userData = getUsersTokenData(req);
        const [results] = await pool.query("SELECT classId, className FROM classes WHERE teacherId = ? ORDER BY className ASC", [userData.id]);
        return res.status(200).json({ err: false, classes: results });
    } catch (err) {
        return res.status(200).json({ err: "Something went wrong with getting the classes" });
    }
}

// Rename class 
exports.renameClass = async (req, res) => {
    const className = req.body.className;
    const classId = req.body.classId;

    if (typeof classId !== "number" || typeof className !== "string") {
        return res.status(400).json({ err: "Class Name needs to be a string and classId number" });
    }

    if (className.length > 100 || className.length < 3) {
        return res.status(400).json({ err: "Class name needs to be between 3 and 100 characters" });
    }

    try {

        const teacherData = getUsersTokenData(req);
        if (!teacherData) {
            return res.status(400).json({ err: "Could not load data correctly" })
        }

        await pool.query(
            'UPDATE classes SET className = ? WHERE classId = ? AND teacherId = ?',
            [className, classId, teacherData.id]
        );

        res.status(200).json({ err: false, msg: 'Class renamed successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "Error with renaming your class, Try again later." });
    }

}

// Delete class 
exports.deleteClass = async (req, res) => {
    
}

// Save teacher test to DB
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

        await pool.query('INSERT INTO tests (testName, teacherId, classId) VALUES (?, ?, ?)', [testName, teacherData.id, classId]);
        res.status(200).json({ err: false, msg: 'Test saved successfully!' });

    } catch (err) {
        if (err) {
            console.log(err);
            return res.status(500).json({ err: "Error with saving your test, Try again later." });
        }
    }

}

// List teachers tests
exports.listTests = async (req, res) => {
    try {
        const classId = req.query.classId;
        if(!classId) throw new Error;
        const userData = getUsersTokenData(req);
        const [results] = await pool.query("SELECT testId, testName FROM tests WHERE teacherId = ? AND classId = ? ORDER BY testName ASC", [userData.id, classId]);
        return res.status(200).json({ err: false, tests: results });
    } catch (err) {
        return res.status(200).json({ err: "Something went wrong with getting the tests" });
    }
}

// Rename test
exports.renameTest = async (req, res) => {
    const testName = req.body.testName;
    const testId = req.body.testId;

    if (typeof testId !== "number" || typeof testName !== "string") {
        return res.status(400).json({ err: "Class Name needs to be a string and classId number" });
    }

    if (testName.length > 500 || testName.length < 3) {
        return res.status(400).json({ err: "Class name needs to be between 3 and 500 characters" });
    }

    try {

        const teacherData = getUsersTokenData(req);
        if (!teacherData) {
            return res.status(400).json({ err: "Could not load data correctly" })
        }

        await pool.query(
            'UPDATE tests SET testName = ? WHERE testId = ? AND teacherId = ?',
            [testName, testId, teacherData.id]
        );

        res.status(200).json({ err: false, msg: 'Test renamed successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "Error with renaming your test, Try again later." });
    }
}

// Delete test
exports.deleteTest = async (req, res) => {

}

/*
Handle Emails
This handles all the logic to setup/handle the email process for all the teacher email logic
/dash/email, it will handle all the logic for emails
*/