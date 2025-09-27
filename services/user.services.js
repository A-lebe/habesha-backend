const db= require("../dbconfig/DBconfig");
const bcrypt = require("bcryptjs");

// ✅ Create user
const createUser = async ({ user_firstName, user_lastName, user_email, user_password }) => {
  const existing = await db.query("SELECT * FROM users WHERE user_email = ?", [user_email]);
  if (existing.length > 0) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(user_password, 10);

  const result = await db.query(
    `INSERT INTO users (user_firstName, user_lastName, user_email, user_password)
     VALUES (?, ?, ?, ?)`,
    [user_firstName, user_lastName, user_email, hashedPassword]
  );

  return result.insertId;
};

// ✅ Find user by email
const findUserByEmail = async (email) => {
  const rows = await db.query("SELECT * FROM users WHERE user_email = ?", [email]);
  return rows[0];
};

// ✅ Get all users
const getUsers = async () => {
  return await db.query("SELECT user_id, user_firstName, user_lastName, user_email FROM users");
};

// ✅ Get user by ID
const getUserById = async (id) => {
  const rows = await db.query(
    "SELECT user_id, user_firstName, user_lastName, user_email FROM users WHERE user_id = ?",
    [id]
  );
  return rows[0];
};

// ✅ Update user
const updateUser = async (id, { user_firstName, user_lastName, user_email, user_password }) => {
  const existing = await db.query("SELECT * FROM users WHERE user_id = ?", [id]);
  if (existing.length === 0) return false;

  const hashedPassword = user_password
    ? await bcrypt.hash(user_password, 10)
    : existing[0].user_password;

  await db.query(
    `UPDATE users 
     SET user_firstName = ?, user_lastName = ?, user_email = ?, user_password = ? 
     WHERE user_id = ?`,
    [user_firstName, user_lastName, user_email, hashedPassword, id]
  );

  return true;
};

// ✅ Delete user
const deleteUser = async (id) => {
  const result = await db.query("DELETE FROM users WHERE user_id = ?", [id]);
  return result.affectedRows > 0;
};

module.exports = {
  createUser,
  findUserByEmail,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
