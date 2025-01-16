const db = require("../config/database");


exports.signin = (req, res) => {
    
}

exports.login = (req, res) => {
    const { email, password } = req.body;

    // Verify that email and password are strings
    if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).render("pages/auth", { err: 'Invalid input type' });
    }

    // Check that email is in a valid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).render("pages/auth", { err: 'Invalid email format' });
    }

    // Ensure password is greater than 3 characters
    if (password.length <= 3) {
        return res.status(400).render("pages/auth", { err: 'Password must be greater than 3 characters' });
    }


    /*
        Check for there username/password in database
    */


    // Send them to dash when completed but home since its done for now
    return res.status(200).render("pages/home", { err: 'Validation passed' });
};
