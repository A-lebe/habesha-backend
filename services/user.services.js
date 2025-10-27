const db = require("../dbconfig/DBconfig");
const bcrypt = require("bcryptjs");

// ✅ Create user and assign default role "Customer"
async function createUser({ user_firstName, user_lastName, user_email, user_password }) {
  const conn = await db.pool.getConnection();
  try {
    await conn.beginTransaction();

    // Check if the user already exists
    const [existingRows] = await conn.execute(
      "SELECT user_id FROM users WHERE user_email = ?",
      [user_email]
    );
    if (existingRows.length > 0) {
      await conn.rollback();
      throw new Error("User already exists");
    }

    // Hash password
    const hashed = await bcrypt.hash(user_password, 12);

    // Insert user
    const [result] = await conn.execute(
      `
      INSERT INTO users (user_firstName, user_lastName, user_email, user_password)
      VALUES (?, ?, ?, ?)
      `,
      [user_firstName, user_lastName, user_email, hashed]
    );

    const userId = result.insertId;

    // Assign default role = "Customer"
    const [roleRows] = await conn.execute(
      "SELECT role_id FROM roles WHERE Company_role = 'Customer' LIMIT 1"
    );
    const defaultRoleId = roleRows.length > 0 ? roleRows[0].role_id : 1;

    await conn.execute(
      "INSERT INTO user_role (user_id, role_id) VALUES (?, ?)",
      [userId, defaultRoleId]
    );

    await conn.commit();

    return {
      user_id: userId,
      user_firstName,
      user_lastName,
      user_email,
    };
  } catch (error) {
    await conn.rollback();
    console.error("❌ Error in createUser:", error);
    throw error;
  } finally {
    conn.release();
  }
}

// ✅ Find user by email
async function findUserByEmail(user_email) {
  const rows = await db.query("SELECT * FROM users WHERE user_email = ?", [user_email]);
  return rows.length ? rows[0] : null;
}

// ✅ Get all users
async function getAllUsers() {
  const sql = `
    SELECT 
      u.user_id, u.user_firstName, u.user_lastName, u.user_email, 
      u.CreatedAt, u.UpdatedAt, r.Company_role
    FROM users u
    LEFT JOIN user_role ur ON u.user_id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.role_id
    ORDER BY u.CreatedAt DESC
  `;
  return db.query(sql);
}

// ✅ Get user by ID
async function getUserById(user_id) {
  const sql = `
    SELECT 
      u.user_id, u.user_firstName, u.user_lastName, u.user_email, 
      r.Company_role
    FROM users u
    LEFT JOIN user_role ur ON u.user_id = ur.user_id
    LEFT JOIN roles r ON ur.role_id = r.role_id
    WHERE u.user_id = ?
    LIMIT 1
  `;
  const rows = await db.query(sql, [user_id]);
  return rows.length ? rows[0] : null;
}

// ✅ Update user details
async function updateUser(user_id, { user_firstName, user_lastName, user_email, user_password }) {
  if (user_password) {
    const hashed = await bcrypt.hash(user_password, 12);
    const sql = `
      UPDATE users
      SET user_firstName = ?, user_lastName = ?, user_email = ?, user_password = ?
      WHERE user_id = ?
    `;
    return db.query(sql, [user_firstName, user_lastName, user_email, hashed, user_id]);
  } else {
    const sql = `
      UPDATE users
      SET user_firstName = ?, user_lastName = ?, user_email = ?
      WHERE user_id = ?
    `;
    return db.query(sql, [user_firstName, user_lastName, user_email, user_id]);
  }
}

// ✅ Delete user
async function deleteUser(user_id) {
  return db.query("DELETE FROM users WHERE user_id = ?", [user_id]);
}

// ✅ Get all roles
async function getAllRoles() {
  return db.query("SELECT * FROM roles ORDER BY role_id ASC");
}

module.exports = {
  createUser,
  findUserByEmail,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getAllRoles,
};
