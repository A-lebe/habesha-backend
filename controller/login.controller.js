// backend/controller/auth.controller.js
const authService = require("../services/login.services");

/**
 * @desc Login user
 * @route POST /api/auth/login
 */
exports.loginUser = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);

    if (result.status === "fail") {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Login Controller Error:", error.message);
    res.status(500).json({ status: "error", message: "Server error" });
  }
};
