const { sign, verify } = require("jsonwebtoken");
const config = require("../config/config");
const token_code = config.jwtToken;

const createToken = (token) => {
    const accessToken = sign(token, token_code);
    return accessToken;
};

const getUsersTokenData = (req) => {
    const accessToken = req.cookies["access-token"];

    if (!accessToken) {
        return false;
    }

    try {
        const validToken = verify(accessToken, token_code);

        if (validToken) {
            return validToken;
        }
    } catch (err) {
        return false;
    }
};

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    if (!accessToken) {
        return res.status(400).render("pages/auth", {
            err: "You need to be signed in to view this page",
        });
    }

    try {
        const validToken = verify(accessToken, token_code);

        if (validToken) {
            req.authenticated = true;
            return next();
        }
    } catch (err) {
        res.clearCookie("access-token");
        return res.status(400).render("pages/auth", {
            err: "Invalid token. Please sign in again.",
        });
    }
};

const authMiddleware = (req, res, next) => {
    if (req.cookies && req.cookies['access-token']) {
        res.locals.loggedIn = true;
    } else {
        res.locals.loggedIn = false;
    }
    next();
};

module.exports = { createToken, getUsersTokenData, validateToken, authMiddleware };
