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
        const [results] = await pool.query("SELECT classId, className FROM classes WHERE teacherId = ? ORDER BY orderId ASC", [userData.id]);
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
    const classId = Number(req.body.classId); // Convert to a number

    if (!Number.isInteger(classId)) {
        return res.status(400).json({ err: "Class Id must be a valid integer" });
    }

    try {
        const teacherData = getUsersTokenData(req);
        if (!teacherData) {
            return res.status(400).json({ err: "Cannot load teacher data correctly" });
        }

        // Delete from questions
        await pool.query(
            `DELETE FROM questions WHERE testId IN (
                SELECT testId FROM tests WHERE classId = ?
            )`,
            [classId]
        );

        // Delete from tests
        await pool.query(
            `DELETE FROM tests WHERE classId = ?`,
            [classId]
        );

        // Delete from classes
        await pool.query(
            `DELETE FROM classes WHERE classId = ? AND teacherId = ?`,
            [classId, teacherData.id]
        );

        res.status(200).json({ err: false, msg: "Deleted class successfully!" });
    } catch (err) {
        console.error("Error deleting class:", err);
        res.status(500).json({ err: "Cannot delete class, try again later" });
    }
};

/////////////////////////////////////////////////////////////////////////////////
    exports.updateOrder = async (req, res) => {
        const { classIds } = req.body;  // Array of classIds in the desired order
        console.log("db");
        try {
            const teacherData = getUsersTokenData(req);
            if (!teacherData) {
                return res.status(400).json({ err: "Could not load data correctly" });
            }
    
            if (!Array.isArray(classIds) || classIds.length === 0) {
                return res.status(400).json({ err: "Invalid class order data" });
            }
    
            let query = `
                UPDATE classes
                SET orderId = CASE
            `;
    
            const values = [];
    
            // Dynamically build the query with incrementing orderId values
            classIds.forEach((classId, index) => {
                query += ` WHEN classId = ? THEN ?`;
                values.push(classId, index + 1);  // Incrementing orderId
            });
    
            query += ` END WHERE teacherId = ?`;
            values.push(teacherData.id);
    
            await pool.query(query, values);
    
            res.status(200).json({ err: false, msg: 'Successfully reordered' });
    
        } catch (err) {
            console.error(err);
            return res.status(500).json({ err: "Error with reordering classes. Try again later." });
        }
    };
/////////////////////////////////////////////////////////////////////////////

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
        if (!classId) throw new Error;
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
    const testId = Number(req.body.testId);

    if (!Number.isInteger(testId)) {
        return res.status(400).json({ err: "TestId must be a valid integer" });
    }

    try {
        const teacherData = getUsersTokenData(req);
        if (!teacherData) {
            return res.status(400).json({ err: "Cannot load teacher data correctly" });
        }

        // Delete from questions
        await pool.query(
            `DELETE FROM questions WHERE testId = ?`,
            [testId]
        );

        // Delete from tests
        await pool.query(
            `DELETE FROM tests WHERE testId = ? and teacherId = ?`,
            [testId, teacherData.id]
        );

        res.status(200).json({ err: false, msg: "Deleted test successfully!" });
    } catch (err) {
        console.error("Error deleting class:", err);
        res.status(500).json({ err: "Cannot delete test, try again later" });
    }

}

// List questions and test name from test id
exports.listQuestions = async (req, res) => {
    const testId = Number(req.query.testId);

    if (!Number.isInteger(testId)) {
        return res.status(400).json({ err: "TestId must be a valid integer" });
    }

    try {
        const teacherData = getUsersTokenData(req);
        if (!teacherData) {
            return res.status(400).json({ err: "Cannot load teacher data correctly" });
        }

        const teacherId = teacherData.id;

        const query = `
            SELECT 
                t.testName,
                q.questionNum,
                q.question
            FROM 
                tests t
            LEFT JOIN 
                questions q 
            ON 
                t.testId = q.testId
            WHERE 
                t.testId = ? AND t.teacherId = ?
            ORDER BY 
                q.questionNum ASC
        `;

        const [results] = await pool.query(query, [testId, teacherId]);

        if (results.length === 0) {
            return res.status(404).json({ err: "No test found for the given testId and teacherId" });
        }

        // Structure the response
        const response = {
            testName: results[0].testName || null,
            questions: results[0].questionNum
                ? results.map(row => ({
                    questionNum: row.questionNum,
                    question: row.question
                }))
                : []
        };

        return res.status(200).json(response);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: "Can't list the questions for that testId" });
    }
};

// Update questions from test id
exports.updateQuestions = async (req, res) => {
    const testId = req.body.testId;
    const questions = req.body.questions;

    if (!Number.isInteger(testId)) {
        return res.status(400).json({ err: "TestId must be a valid integer" });
    }

    try {
        const teacherData = getUsersTokenData(req);
        if (!teacherData) {
            return res.status(400).json({ err: "Cannot load teacher data correctly" });
        }
        const teacherId = teacherData.id;

        // Delete questions
        await pool.query(`DELETE q FROM questions q INNER JOIN tests t ON q.testId = t.testId WHERE q.testId = ? AND t.teacherId = ?`, [testId, teacherId]);

        // Add new test Questions
        for (let i = 0; i < questions.length; i++) {
            await pool.query("INSERT INTO questions (questionNum, question, testId) VALUES (?, ?, ?)", [questions[i].number, questions[i].question, testId])
        }

        return res.status(200).json({ err: false, msg: "Questions saved successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ err: "Can't save the questions for that test" });
    }

}

/*
Handle Emails
This handles all the logic to setup/handle the email process for all the teacher email logic
/dash/email, it will handle all the logic for emails
*/