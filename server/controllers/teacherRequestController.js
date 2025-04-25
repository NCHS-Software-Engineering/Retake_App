const pool = require("../config/database");
const { getUsersTokenData } = require("../middleware/jwt");

// Render retake request page
exports.requestss = async (req, res) => {

    // <%=request.email%>, Class: <%= request.className %>, Test: <%= request.testName %>

   

        

    try {
        const userData = getUsersTokenData(req);

        const [classes] = await pool.query(`
            SELECT classId, className FROM classes WHERE teacherId = ?`,
            [userData.id]);

        const [requests] = await pool.query(`
            SELECT  r.testId, u.email, c.className, t.testName
            FROM retakeRequests r
            JOIN users u ON u.userId = ?
            JOIN tests t ON r.testId = t.testId
            JOIN classes c ON t.classId = c.classId
            WHERE t.teacherId = ?
            `, [userData.id,userData.id]);

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

exports.createNewStuRequest = async (req, res) => {
    
    try {
        const userData = getUsersTokenData(req);
        const { testId, usersName, questionString } = req.body;
        
        // Insert into retakeRequests table and add in testId and usersName, and make userId 0
        const [result] = await pool.query(
            `INSERT INTO retakeRequests (userId, testId, usersName, questionString) 
            VALUES (?, ?, ?, ?)`,
            [0, testId, usersName, questionString]
        );

        return res.status(200).json({ err: false, msg: "Added student successfully" });
    } catch (err) {
        console.error(err);
        return res.status(400).json({ err: "Something went wrong", requests: [] });
    }

};
exports.requests = async (req, res) =>
    {
        try {
            const userData = getUsersTokenData(req);
    
            const [classes] = await pool.query(`
                SELECT classId, className FROM classes WHERE teacherId = ?`,
                [userData.id,userData.email]);
    
            const [requests] = await pool.query(`
                SELECT  r.testId, u.email, c.className, t.testName, r.userEmail
                FROM retakeRequests r
                JOIN users u ON u.email = r.userEmail
                JOIN tests t ON r.testId = t.testId

                JOIN classes c ON t.classId = c.classId
              
                `, [userData.id,userData.email]);
    
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