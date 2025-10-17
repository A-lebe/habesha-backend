const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userService = require("../services/user.services");

const login = async (userData) => {
  try {
    const user = await userService.findUserByEmail(userData.user_email);

    if (!user) {
      return { status: "fail", message: "User not found" };
    }

    const passwordMatch = await bcrypt.compare(
      userData.user_password_value,
      user.user_password
    );

    if (!passwordMatch) {
      return { status: "fail", message: "Incorrect password" };
    }

    // ✅ Create JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_email: user.user_email,
        user_firstName: user.user_firstName,
        user_lastName: user.user_lastName,
        user_role: user.user_role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    // ✅ Return user data + token
    return {
      status: "success",
      data: {
        ...user,
        user_token: token,
      },
    };
  } catch (error) {
    console.error("Login Service Error:", error.message);
    return {
      status: "fail",
      message: "An error occurred during the login process",
    };
  }
};

module.exports = { login };
