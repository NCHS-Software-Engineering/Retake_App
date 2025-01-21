const express = require("express");
const router = express.Router();

const { validateToken } = require("../middleware/jwt");

// Home Page
router.get("/", (req, res) => {
    return res.status(200).render("pages/home");
})

// About Page
router.get("/about", (req, res) => {
    return res.status(200).render("pages/about");
})

// Help Page
router.get("/help", (req, res) => {
    return res.status(200).render("pages/help");
})

// User Account Page
router.get("/account", validateToken, (req, res) => {
    return res.status(200).render("pages/account");
})

// Auth page
router.get("/auth", (req, res) => {
    return res.status(200).render("pages/auth");
})

module.exports = router;