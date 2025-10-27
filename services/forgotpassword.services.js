const db = require("../dbconfig/DBconfig");

/**
 * 🔹 Find a user by their email address.
 * @param {string} email
 * @returns {object|null} User record or null if not found
 */
const findUserByEmail = async (email) => {
  try {
    const rows = await db.query(
      "SELECT * FROM users WHERE user_email = ? LIMIT 1",
      [email]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("❌ Error finding user by email:", error);
    throw error;
  }
};

/**
 * 🔹 Save a password reset token in the database.
 * @param {string} email
 * @param {string} hashedToken
 */
const saveResetToken = async (email, hashedToken) => {
  try {
    await db.query(
      "INSERT INTO password_resets (user_email, reset_token) VALUES (?, ?)",
      [email, hashedToken]
    );
  } catch (error) {
    console.error("❌ Error saving reset token:", error);
    throw error;
  }
};

/**
 * 🔹 Find the most recent password reset entry by token.
 * @param {string} hashedToken
 * @returns {object|null} Password reset entry or null
 */
const findResetByToken = async (hashedToken) => {
  try {
    const rows = await db.query(
      "SELECT * FROM password_resets WHERE reset_token = ? ORDER BY created_at DESC LIMIT 1",
      [hashedToken]
    );
    return rows[0] || null;
  } catch (error) {
    console.error("❌ Error finding reset by token:", error);
    throw error;
  }
};

/**
 * 🔹 Update the user's password with a new hashed password.
 * @param {string} email
 * @param {string} hashedPassword
 */
const updateUserPassword = async (email, hashedPassword) => {
  try {
    await db.query(
      "UPDATE users SET user_password = ? WHERE user_email = ?",
      [hashedPassword, email]
    );
  } catch (error) {
    console.error("❌ Error updating user password:", error);
    throw error;
  }
};

/**
 * 🔹 Delete a used or expired password reset token.
 * @param {string} hashedToken
 */
const deleteToken = async (hashedToken) => {
  try {
    await db.query(
      "DELETE FROM password_resets WHERE reset_token = ?",
      [hashedToken]
    );
  } catch (error) {
    console.error("❌ Error deleting reset token:", error);
    throw error;
  }
};

module.exports = {
  findUserByEmail,
  saveResetToken,
  findResetByToken,
  updateUserPassword,
  deleteToken,
};
