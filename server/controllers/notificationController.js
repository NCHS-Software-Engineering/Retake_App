const pool = require('../config/database');
const { getUsersTokenData } = require('../middleware/jwt');

exports.list = async (req, res) => {
    // Pull everything from retakeRequests from pool where there userId from the testId matchs the userId in the test
    try {

        const userData = getUsersTokenData(req);
        if (!userData) {
            return res.status(400).json({ err: "You need to be signed in to view this page" });
        }

        // This is the current teachers Id
        const teacherId = userData.id;

        // Db schema:
        // retakeRequest -> testId, userId, retakeId
        // tests -> testId, teacherId, testName
        // users -> userId, username

        // Get the (retakeId, testId, username) where the testId matches the teacherId
        const [rows] = await pool.query(`
                                        SELECT 
                                            rr.requestId, 
                                            rr.testId, 
                                            u.username 
                                        FROM retakeRequests rr
                                        JOIN tests t ON rr.testId = t.testId
                                        JOIN users u ON rr.userId = u.userId
                                        WHERE t.teacherId = ?
                                    `, [teacherId]);

        return res.status(200).json({ err: false, rows });

    } catch (err) {
        if (err) {
            console.log(err);
            return res.status(400).json({ err: "There was an error getting the notifications" });
        }
    }
}

exports.remove = async (req, res) => {

    // This is a delete req, get the retakeId from the req body
    const { retakeId } = req.body;

    try {


        const userData = getUsersTokenData(req);
        if (!userData) {
            return res.status(400).json({ err: "You need to be signed in to view this page" });
        }
        // This is the current teachers Id
        const teacherId = userData.id;


        // Delete the retakeRequest where the retakeId matches the retakeId from the req body, and make sure the retakeRequests -> testId goes to tests -> testId, teacherId... make sure local teacherId matches teacherId
        await pool.query(`DELETE retakeRequests FROM retakeRequests JOIN tests ON retakeRequests.testId = tests.testId WHERE retakeRequests.requestId = ? AND tests.teacherId = ?`, [retakeId, teacherId]);

        return res.status(200).json({ err: false, msg: "Notification deleted" });


    } catch (err) {
        if (err) {
            return res.status(400).json({ err: "There was an error deleting the notification" });
        }
    }

}