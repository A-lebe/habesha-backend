const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const {
  findUserByEmail,
  saveResetToken,
  findResetByToken,
  updateUserPassword,
  deleteToken,
} = require("../repository/passwordReset.repository");

// ⚡ Optional: use a proper mailer in production (e.g., Nodemailer)
const sendResetEmail = async (email, resetToken) => {
  // In production, this should be replaced with a real email service.
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  console.log(`📩 Reset email would be sent to ${email}: ${resetUrl}`);
};

/**
 * 🔹 Step 1: Request password reset (generate and save token)
 */
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save token in DB
    await saveResetToken(email, hashedToken);

    // Send email (replace with real mailer)
    await sendResetEmail(email, resetToken);

    res.json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("❌ Error in requestPasswordReset:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 🔹 Step 2: Verify reset token (optional, for frontend validation)
 */
exports.verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const resetEntry = await findResetByToken(hashedToken);

    if (!resetEntry) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.json({ message: "Token is valid" });
  } catch (error) {
    console.error("❌ Error in verifyResetToken:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * 🔹 Step 3: Reset password with a valid token
 */
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    // Hash the provided token and find it in DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const resetEntry = await findResetByToken(hashedToken);

    if (!resetEntry) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user’s password
    await updateUserPassword(resetEntry.user_email, hashedPassword);

    // Delete the token after successful reset
    await deleteToken(hashedToken);

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("❌ Error in resetPassword:", error);
    res.status(500).json({ message: "Server error" });
  }
};
