// backend/services/userService.js
const db = require("../dbconfig/DBconfig");
const bcrypt = require("bcryptjs");

// ✅ Create user with default role assignment
const createUser = async ({ user_firstName, user_lastName, user_email, user_password }) => {
  try {
    // Check if user already exists
    const existing = await db.query("SELECT * FROM users WHERE user_email = ?", [user_email]);
    if (existing.length > 0) throw new Error("User already exists");

    // Hash password
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Insert new user
    const result = await db.query(
      `INSERT INTO users (user_firstName, user_lastName, user_email, user_password)
       VALUES (?, ?, ?, ?)`,
      [user_firstName, user_lastName, user_email, hashedPassword]
    );

    // Get inserted user ID
    const userId = result.insertId;

    // Assign default role (e.g., 1 = "User")
    const defaultRoleId = 1;
    await db.query(
      `INSERT INTO user_role (user_id, role_id) VALUES (?, ?)`,
      [userId, defaultRoleId]
    );

    return { user_id: userId, user_firstName, user_lastName, user_email };
  } catch (error) {
    console.error("Error in createUser:", error);
    throw error;
  }
};

// ✅ Find user by email
const findUserByEmail = async (email) => {
  try {
    const rows = await db.query("SELECT * FROM users WHERE user_email = ?", [email]);
    return rows[0];
  } catch (error) {
    console.error("Error in findUserByEmail:", error);
    throw error;
  }
};

// ✅ Get all users (with roles)
const getUsers = async () => {
  try {
    const rows = await db.query(`
      SELECT 
        u.user_id,
        u.user_firstName,
        u.user_lastName,
        u.user_email,
        r.Company_role AS role
      FROM users u
      LEFT JOIN user_role ur ON u.user_id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.role_id
    `);
    return rows;
  } catch (error) {
    console.error("Error in getUsers:", error);
    throw error;
  }
};

// ✅ Get single user by ID (with role)
const getUserById = async (id) => {
  try {
    const rows = await db.query(`
      SELECT 
        u.user_id,
        u.user_firstName,
        u.user_lastName,
        u.user_email,
        r.Company_role AS role
      FROM users u
      LEFT JOIN user_role ur ON u.user_id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.role_id
      WHERE u.user_id = ?
    `, [id]);
    return rows[0];
  } catch (error) {
    console.error("Error in getUserById:", error);
    throw error;
  }
};

// ✅ Update user (name, email, and optionally role)
const updateUser = async (id, { user_firstName, user_lastName, user_email, role_id }) => {
  try {
    // Check if user exists
    const existing = await db.query("SELECT * FROM users WHERE user_id = ?", [id]);
    if (existing.length === 0) throw new Error("User not found");

    // Update basic info
    await db.query(
      `UPDATE users
       SET user_firstName = ?, user_lastName = ?, user_email = ?
       WHERE user_id = ?`,
      [user_firstName, user_lastName, user_email, id]
    );

    // Optionally update user role
    if (role_id) {
      const roleExists = await db.query("SELECT * FROM roles WHERE role_id = ?", [role_id]);
      if (roleExists.length === 0) throw new Error("Invalid role ID");

      await db.query(
        `UPDATE user_role
         SET role_id = ?
         WHERE user_id = ?`,
        [role_id, id]
      );
    }

    // Return updated user with role
    const updatedUser = await getUserById(id);
    return updatedUser;
  } catch (error) {
    console.error("Error in updateUser:", error);
    throw error;
  }
};

// ✅ Delete user (and automatically delete role relation due to cascade)
const deleteUser = async (id) => {
  try {
    const result = await db.query("DELETE FROM users WHERE user_id = ?", [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error in deleteUser:", error);
    throw error;
  }
};

module.exports = {
  createUser,
  findUserByEmail,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
