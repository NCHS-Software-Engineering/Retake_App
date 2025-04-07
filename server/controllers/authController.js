const pool = require("../config/database");
const config = require("../config/config");
const { createToken } = require("../middleware/jwt");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(
    config.google.clientId,
    config.google.clientSecret,
    'http://localhost:8080/auth/google/callback'
);


exports.googleCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            throw new Error("Authorization code is missing");
        }

        const { tokens } = await client.getToken({
            code,
            client_id: config.google.clientId,
            client_secret: config.google.clientSecret,
            redirect_uri: 'http://localhost:8080/auth/google/callback',
        });

        if (!tokens.id_token) {
            throw new Error("Failed to get ID token");
        }

        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: config.google.clientId,
        });

        const payload = ticket.getPayload();

        const email = payload.email;
        const username = payload.name;
        const googleToken = tokens.id_token;

        if (email.endsWith('naperville203.org')) {
            try {
                let role = "";
                if (email.endsWith('@stu.naperville203.org')) {
                    role = "student";
                } else if (email.endsWith('@naperville203.org')) {
                    role = "teacher";
                }

                const [rows] = await pool.query('SELECT * FROM users WHERE googleToken = ?', [googleToken]);

                if (rows.length > 0) {
                    // User already exists, log them in
                    const user = rows[0];
                    const tokenData = { googleToken: googleToken, id: user.userId, type: user.type };
                    const accessToken = createToken(tokenData);

                    res.cookie('access-token', accessToken, {
                        maxAge: 2592000000,
                        httpOnly: true
                    });

                    return res.status(200).redirect("/dash");
                } else {
                    // Create a new user
                    const [result] = await pool.query(
                        'INSERT INTO users (username, googleToken, type) VALUES (?, ?, ?)', [
                        username,
                        googleToken,
                        role,
                    ]);

                    const user = { userId: result.insertId, type: role };

                    const tokenData = { googleToken: googleToken, id: user.userId, type: user.type };
                    const accessToken = createToken(tokenData);

                    res.cookie('access-token', accessToken, {
                        maxAge: 2592000000,
                        httpOnly: true
                    });

                    return res.status(200).redirect("/dash");
                }
            } catch (err) {
                console.error('Error during login:', err);
                return res.status(500).render("pages/auth", { err: 'An error occurred, please try again later.' });
            }
        } else {
            return res.status(500).render("pages/auth", { err: 'Invalid email address.' });
        }
    } catch (error) {
        console.error('Google auth error:', error.message);
        res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
};