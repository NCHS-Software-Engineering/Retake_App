const { sign, verify } = require("jsonwebtoken");
const config = require("../config/config");
const token_code = config.jwtToken;

/**
 * Creates a JWT token for the user.
 * 
 * @param {Object} user - The user object containing `username` and `email`.
 * @returns {string} - The generated JWT token as a string.
 */
const createToken = (user) => {
    // Create a JWT token using the user's username and email
    const accessToken = sign(user, token_code);
    return accessToken;
};

/**
 * Extracts and verifies user data from the access token stored in cookies.
 * 
 * @param {Object} req - The HTTP request object.
 * @returns {Object|boolean} - Returns user data if the token is valid, otherwise `false`.
 */
const getUsersTokenData = (req) => {
    // Extract the access token from cookies
    const accessToken = req.cookies["access-token"];

    if (!accessToken) {
        return false; // No token present
    }

    try {
        // Verify the token using the secret key
        const validToken = verify(accessToken, token_code);

        if (validToken) {
            // Return extracted user data
            return validToken;
        }
    } catch (err) {
        // Token verification failed
        return false;
    }
};

/**
 * Middleware to validate the user's JWT token and protect routes.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function in the stack.
 * @returns {Object|void} - Proceeds to the next middleware if token is valid, otherwise responds with an error.
 */
const validateToken = (req, res, next) => {
    // Extract the access token from cookies
    const accessToken = req.cookies["access-token"];

    if (!accessToken) {
        // Render authentication page if no token is found
        return res.status(400).render("pages/auth", {
            err: "You need to be signed in to view this page",
        });
    }

    try {
        // Verify the token using the secret key
        const validToken = verify(accessToken, token_code);

        if (validToken) {
            // Mark the request as authenticated and proceed
            req.authenticated = true;
            return next();
        }
    } catch (err) {
        // Clear the invalid token and return an error
        res.clearCookie("access-token");
        return res.status(400).render("pages/auth", {
            err: "Invalid token. Please sign in again.",
        });
    }
};

module.exports = { createToken, getUsersTokenData, validateToken };
