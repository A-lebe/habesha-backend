const express = require("express");
const router = express.Router();
const loginController = require("../controller/login.controller");

router.post("/user/login", loginController.Login);

module.exports = router;