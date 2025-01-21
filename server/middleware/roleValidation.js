const pool = require("../config/database");

const { getUsersTokenData } = require("./jwt");

const validateTeacher = async (req, res, next) => {
    try {
        const userData = getUsersTokenData(req);

        if (!userData) {
            return res.status(401).render("pages/auth", { err: "You need to be signed in to view this page" });
        }

        if (userData.type === "teacher") {
            return next();
        }

        return res.status(403).render("pages/auth", { err: "Access restricted to teachers only" });
    } catch (err) {
        console.error("Error in validateTeacher middleware:", err);
        return res.status(500).render("pages/auth", { err: "An error occurred while validating access" });
    }
};

const validateStudent = async (req, res, next) => {
    try {
        const userData = getUsersTokenData(req);

        if (!userData) {
            return res.status(401).render("pages/auth", { err: "You need to be signed in to view this page" });
        }

        if (userData.type === "student") {
            return next();
        }

        return res.status(403).render("pages/auth", { err: "Access restricted to students only" });
    } catch (err) {
        console.error("Error in validateStudent middleware:", err);
        return res.status(500).render("pages/auth", { err: "An error occurred while validating access" });
    }
};


module.exports = { validateStudent, validateTeacher }