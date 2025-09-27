const express = require("express");
const router = express.Router();
const passwordResetController = require("../controller/passwordReset.controller");

// Create reset token
router.post("/password-reset", passwordResetController.requestPasswordReset);

// Get reset token by email
router.get("/password-reset/:email", passwordResetController.getResetToken);

// Delete token by email
router.delete(
  "/password-reset/:email",
  passwordResetController.deleteResetToken
);

module.exports = router;
