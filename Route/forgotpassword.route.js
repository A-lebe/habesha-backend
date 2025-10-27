const express = require("express");
const router = express.Router();
const {
  requestPasswordReset,
  verifyResetToken,
  resetPassword,
} = require("../controller/passwordReset.controller");

// 🔹 Step 1: Request reset
router.post("/password-reset/request", requestPasswordReset);

// 🔹 Step 2: Verify token
router.get("/password-reset/verify/:token", verifyResetToken);

// 🔹 Step 3: Reset password
router.post("/password-reset/reset", resetPassword);

module.exports = router;
