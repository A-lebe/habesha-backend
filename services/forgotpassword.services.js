const db = require("../DBConfig/DBconfig");

// Find user by email
const findUserByEmail = async (email) => {
  const rows = await db.query("SELECT * FROM users WHERE user_email = ?", [
    email,
  ]);
  return rows[0];
};

// Save reset token
const saveResetToken = async (email, hashedToken) => {
  await db.query(
    "INSERT INTO password_resets (user_email, reset_token) VALUES (?, ?)",
    [email, hashedToken]
  );
};

// Find reset entry by token
const findResetByToken = async (hashedToken) => {
  const rows = await db.query(
    "SELECT * FROM password_resets WHERE reset_token = ? ORDER BY created_at DESC LIMIT 1",
    [hashedToken]
  );
  return rows[0];
};

// Update user password
const updateUserPassword = async (email, hashedPassword) => {
  await db.query("UPDATE users SET user_password = ? WHERE user_email = ?", [
    hashedPassword,
    email,
  ]);
};

// Delete used token
const deleteToken = async (hashedToken) => {
  await db.query("DELETE FROM password_resets WHERE reset_token = ?", [
    hashedToken,
  ]);
};

module.exports = {
  findUserByEmail,
  saveResetToken,
  findResetByToken,
  updateUserPassword,
  deleteToken,
};
