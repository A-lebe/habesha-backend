// backend/services/auth.services.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../dbconfig/DBconfig");
require("dotenv").config();

/**
 * 🔍 Find user by email
 */
async function findUserByEmail(email) {
  const sql = `SELECT * FROM users WHERE user_email = ?`;
  const rows = await query(sql, [email]);
  return rows[0];
}

/**
 * 🔍 Get user's role(s)
 */
async function getUserRoles(userId) {
  const sql = `
    SELECT r.company_role 
    FROM roles r
    JOIN user_role ur ON r.role_id = ur.role_id
    WHERE ur.user_id = ?
  `;
  const rows = await query(sql, [userId]);
  return rows.map((r) => r.company_role); // returns array of role names
}

/**
 * 🔑 Generate JWT token (now includes user_role)
 */
function generateToken(user, roles) {
  return jwt.sign(
    {
      id: user.user_id,
      firstName: user.user_firstName,
      lastName: user.user_lastName,
      email: user.user_email,
      roles, // array of user roles, e.g. ["admin", "customer"]
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * 🧠 Login user (validate credentials)
 */
async function loginUser(userData) {
  const { user_email, user_password } = userData;

  // 1️⃣ Check if user exists
  const user = await findUserByEmail(user_email);
  if (!user) {
    return { status: "fail", message: "User not found" };
  }

  // 2️⃣ Validate password
  const isMatch = await bcrypt.compare(user_password, user.user_password);
  if (!isMatch) {
    return { status: "fail", message: "Invalid password" };
  }

  // 3️⃣ Get user roles
  const roles = await getUserRoles(user.user_id);

  // 4️⃣ Generate token
  const token = generateToken(user, roles);

  // 5️⃣ Return response
  return {
    status: "success",
    message: "Login successful",
    token,
    user: {
      id: user.user_id,
      firstName: user.user_firstName,
      lastName: user.user_lastName,
      email: user.user_email,
      roles,
    },
  };
}

module.exports = { loginUser };
