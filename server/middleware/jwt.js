const { sign, verify } = require("jsonwebtoken");
// const creds = require("../creds/creds");
const token_code = "test123";

const createToken = (user) => {
    // Uses username and email to create token (str)
    const accessToken = sign({ username: user.username, email: user.email }, token_code);
    return accessToken;
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies["access-token"];

    if(!accessToken) {
        return res.render("pages/auth", {
            err: "Need to be signed in to view this page"
        })
    }

    try {
        const validToken = verify(accessToken, token_code);

        if(validToken) {
            req.authenticated = true;
            return next();
        }
    } catch(err) {
        res.clearCookie("access-token");
        return res.status(400).render("pages/auth", {
            err: "Token invalid"
        })
    }
}

module.exports = { createToken, validateToken };