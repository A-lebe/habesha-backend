const express = require("express");
const router = express.Router();
const forgotPasswordController = require("../controllers/forgotPassword.controller");

// Request password reset link
router.post("/forgot-password", forgotPasswordController.forgotPassword);

// Reset password with token
router.post("/reset-password/:token", forgotPasswordController.resetPassword);

module.exports = router;
