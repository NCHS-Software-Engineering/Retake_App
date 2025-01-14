const express = require("express");
const router = express.Router();

// Home Page
router.get("/", (req, res) => {
    return res.status(200).render("index");
})

// About Page
router.get("/about", (req, res) => {
    return res.status(200).render("about");
})

// Help Page
router.get("/help", (req, res) => {
    return res.status(200).render("help");
})

// Dashboard Page
router.get("/dash", (req, res) => {
    return res.status(200).render("dash");
})

// User Account Page
router.get("/account", (req, res) => {
    return res.status(200).render("account");
})

// Auth page
router.get("/auth", (req, res) => {
    return res.status(200).render("auth");
})

module.exports = router;