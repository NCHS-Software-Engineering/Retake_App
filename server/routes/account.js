const express = require("express");
const router = express();

// Controllers
const accountController = require("../controllers/accountController");

// Changes the nickname of user
router.post("/changeNickname", accountController.changeNickname);

module.exports = router;