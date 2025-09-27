const passwordResetService = require("../service/passwordReset.service");

// Create reset token
async function requestPasswordReset(req, res) {
  try {
    const { user_email, reset_token } = req.body;
    if (!user_email || !reset_token) {
      return res.status(400).json({ message: "Missing email or token" });
    }
    await passwordResetService.createResetToken(user_email, reset_token);
    res.status(201).json({ message: "Reset token stored" });
  } catch (error) {
    console.error("Error creating reset token:", error);
    res.status(500).json({ message: "Failed to create reset token" });
  }
}

// Get latest reset token by email
async function getResetToken(req, res) {
  try {
    const email = req.params.email;
    const token = await passwordResetService.getResetTokenByEmail(email);
    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }
    res.status(200).json(token);
  } catch (error) {
    console.error("Error fetching reset token:", error);
    res.status(500).json({ message: "Failed to get token" });
  }
}

// Optional: Delete token
async function deleteResetToken(req, res) {
  try {
    const email = req.params.email;
    await passwordResetService.deleteResetTokenByEmail(email);
    res.status(200).json({ message: "Token deleted" });
  } catch (error) {
    console.error("Error deleting token:", error);
    res.status(500).json({ message: "Failed to delete token" });
  }
}

module.exports = {
  requestPasswordReset,
  getResetToken,
  deleteResetToken,
};
