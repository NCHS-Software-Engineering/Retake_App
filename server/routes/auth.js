const express = require("express");
const router = express();

// Controllers
const authController = require("../controllers/authController");

router.post("/login", (req, res) => {
    return res.status(400).json({err: true, msg: "Cant find account"});
})

router.post("/signin", (req, res) => {
    return res.status(400).json({err: true, msg: "Cant create account"});
})

module.exports = router;