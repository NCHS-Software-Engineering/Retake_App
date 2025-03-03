const pool = require("../config/database");
const config = require("../config/config");
const { createToken } = require("../middleware/jwt");



exports.login = async (req, res) => {
    const { email, username, googleToken } = req.body;


    if (email.endsWith('@stu.naperville203.org') || email.endsWith('@naperville203.org')) {
        try {
            const role = "";
            if (email.endsWith('@stu.naperville203.org')) {
                role = "student";
            } else if (email.endsWith('@naperville203.org')) {
                role = "teacher";
            }
            const [rows] = await pool.query('SELECT * FROM users WHERE googleToken = ?', [googleToken]);

            if (rows.length === 0) {
                const [result] = await pool.query(
                    'INSERT INTO users (username, googleToken, type) VALUES (?, ?, ?)', [
                    username,
                    googleToken,
                    role,
                ]
                );

                rows[0] = { userId: result.insertId, type: role };
            }


            const user = rows[0];

            const tokenData = { token: googleToken, id: user.userId, type: user.type };
            const accessToken = createToken(tokenData);

            res.cookie('access-token', accessToken, {
                maxAge: 2592000000,
                httpOnly: true
            })

            return res.status(200).redirect("/dash");
        } catch (err) {
            console.error('Error during login:', err);
            return res.status(500).render("pages/auth", { err: 'An error occurred, please try again later.' });
        }
    }
    else {
        return res.status(500).render("pages/auth", { err: 'Invalid email adress.' });
    }
};