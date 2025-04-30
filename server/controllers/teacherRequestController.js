const pool = require("../config/database");
const { getUsersTokenData } = require("../middleware/jwt");

exports.createNewStuRequest = async (req, res) => {
    
    try {
        const userData = getUsersTokenData(req);
        const { testId, usersName, questionString } = req.body;
        
        // Insert into retakeRequests table and add in testId and usersName, and make userId 0
        const [result] = await pool.query(
            `INSERT INTO retakeRequests (userId, testId, userEmail, usersName, questionString) 
            VALUES (?, ?, ?, ?, ?)`,
            [0, testId, usersName, usersName, questionString]
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
                SELECT  r.testId, u.email, c.className, t.testName
                FROM retakeRequests r
                JOIN tests t ON r.testId = t.testId AND t.teacherId = ?
                JOIN users u ON u.userId = r.userId OR r.userId = 0
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