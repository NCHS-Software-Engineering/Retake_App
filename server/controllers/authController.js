const argon2 = require("argon2");

const pool = require("../config/database");
const config = require("../config/config");
const { createToken } = require("../middleware/jwt");

// Validates params for login/signin
function validateParams(email, password, username = "0000") {
    // Verify that email, password, and username are strings
    if (typeof email !== 'string' || typeof password !== 'string' || typeof username !== 'string') {
        return { err: 'Invalid input type' };
    }

    // Ensure password is between 4 and 64 characters
    if (password.length <= 3 || password.length >= 64) {
        return { err: 'Password must be greater than 3 characters and less than 64 characters' };
    }

    // Check email length (between 6 and 320 characters)
    if (email.length <= 5 || email.length >= 320) {
        return { err: 'Email must be greater than 5 characters and less than 320 characters' };
    }

    // Check that email is in a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { err: 'Invalid email format' };
    }

    // Ensure username is between 4 and 20 characters
    if (username.length <= 3 || username.length >= 20) {
        return { err: 'Username must be greater than 3 characters and less than 20 characters' };
    }

    return { err: false };
}

const hashPassword = async (password) => {
    try {
        const secretKey = Buffer.from(config.passHashToken);
        const hash = await argon2.hash(password, {
            type: argon2.argon2id,
            memoryCost: 2 ** 17,  // 128 MB
            timeCost: 4,          // 4 iterations
            parallelism: 2,       // 2 threads
            hashLength: 128,      // 128 bytes
            saltLength: 16,       // 16 bytes
            secret: secretKey,
        });
        return hash;
    } catch (err) {
        console.error('Error hashing password:', err);
        throw err;
    }
};

const verifyPassword = async (hashedPassword, plainPassword) => {
    try {
        const secretKey = Buffer.from(config.passHashToken);
        return await argon2.verify(hashedPassword, plainPassword, { secret: secretKey });
    } catch (err) {
        console.error('Error verifying password:', err);
        throw err;
    }
};

exports.signin = async (req, res) => {
    const { email, password, username } = req.body;

    const paramsValid = validateParams(email, password, username);
    if (paramsValid.err) {
        return res.status(500).render("pages/auth", paramsValid);
    }

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(500).render("pages/auth", { err: 'There is a user with that email already' });
        }

        const hashedPassword = await hashPassword(password);

        const [result] = await pool.query(
            'INSERT INTO users (email, username, type, passHash) VALUES (?, ?, ?, ?)', [
                email,
                username,
                "teacher",
                hashedPassword,
            ]
        );
        
        const userId = result.insertId;
        const type = "teacher";

        const tokenData = { email: email, id: userId, type: type };
        const accessToken = createToken(tokenData);

        res.cookie('access-token', accessToken, {
            maxAge: 2592000000,
            httpOnly: true
        })

        return res.status(200).render("dash/teacher/dash", { msg: "Created Account Successfully" });
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).render("pages/auth", { err: 'An error occurred, please try again later.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    const paramsValid = validateParams(email, password);
    if (paramsValid.err) {
        return res.status(500).render("pages/auth", paramsValid);
    }

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length === 0) {
            return res.status(500).render("pages/auth", { err: 'Invalid email or password' });
        }

        const user = rows[0];

        const isPasswordValid = await verifyPassword(user.passHash, password);
        if (!isPasswordValid) {
            return res.status(500).render("pages/auth", { err: 'Invalid email or password' });
        }

        const tokenData = { email: email, id: user.userId, type: user.type };
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
};
