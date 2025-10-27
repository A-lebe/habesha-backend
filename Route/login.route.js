// backend/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const authController = require("../controller/login.controller");

// ✅ Login route
router.post("/user/login", authController.loginUser);

module.exports = router;
