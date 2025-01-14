const express = require("express");
const router = express.Router();

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

// Dashboard Page
router.get("/dash", (req, res) => {
    return res.status(200).render("pages/dash");
})

// User Account Page
router.get("/account", (req, res) => {
    return res.status(200).render("pages/account");
})

// Auth page
router.get("/auth", (req, res) => {
    return res.status(200).render("pages/auth");
})

module.exports = router;