// backend/controller/user.controller.js
const db = require("../dbconfig/DBconfig");
const bcrypt = require("bcryptjs");
console.log("✅ user.controller.js loaded");



// ========================= REGISTER USER =========================
exports.registerUser = async (req, res) => {
  try {
    const { user_firstName, user_lastName, user_email, user_password, user_role, role_id } = req.body;

    if (!user_firstName || !user_lastName || !user_email || !user_password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const existingUser = await db.query("SELECT * FROM users WHERE user_email = ?", [user_email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Insert user
    const result = await db.query(
      `INSERT INTO users (user_firstName, user_lastName, user_email, user_password)
       VALUES (?, ?, ?, ?)`,
      [user_firstName, user_lastName, user_email, hashedPassword]
    );

    const userId = result.insertId;

    // Determine role_id
    let assignedRoleId = role_id;
    if (!assignedRoleId && user_role) {
      // If frontend sent role name (e.g., "admin"), find its role_id
      const roleRows = await db.query(
        "SELECT role_id FROM roles WHERE Company_role = ? LIMIT 1",
        [user_role]
      );
      assignedRoleId = roleRows.length > 0 ? roleRows[0].role_id : 1; // fallback to customer
    }
    if (!assignedRoleId) assignedRoleId = 1; // default to customer if none found

    // Insert role
    await db.query("INSERT INTO user_role (user_id, role_id) VALUES (?, ?)", [userId, assignedRoleId]);

    // Get role name to return
    const roleNameRow = await db.query("SELECT Company_role FROM roles WHERE role_id = ?", [assignedRoleId]);
    const userRoleName = roleNameRow.length > 0 ? roleNameRow[0].Company_role : "Customer";

    res.status(201).json({
      message: "✅ User registered successfully",
      user_id: userId,
      user_firstName,
      user_lastName,
      user_email,
      user_role: userRoleName,
    });
  } catch (error) {
    console.error("❌ Register error:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= GET ALL USERS =========================
exports.getAllUsers = async (req, res) => {
  try {
    const sql = `
      SELECT 
        u.user_id, u.user_firstName, u.user_lastName, u.user_email, 
        u.CreatedAt, u.UpdatedAt, r.Company_role
      FROM users u
      LEFT JOIN user_role ur ON u.user_id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.role_id
      ORDER BY u.CreatedAt DESC
    `;
    const users = await db.query(sql);
    res.json(users);
  } catch (error) {
    console.error("❌ Get all users error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= GET USER BY ID =========================
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
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
    const rows = await db.query(sql, [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("❌ Get user by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= UPDATE USER =========================
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { user_firstName, user_lastName, user_email, user_password } = req.body;

    if (!user_firstName || !user_lastName || !user_email) {
      return res.status(400).json({ message: "First name, last name, and email are required" });
    }

    if (user_password) {
      // Hash new password
      const hashedPassword = await bcrypt.hash(user_password, 10);
      const sql = `
        UPDATE users
        SET user_firstName = ?, user_lastName = ?, user_email = ?, user_password = ?
        WHERE user_id = ?
      `;
      await db.query(sql, [user_firstName, user_lastName, user_email, hashedPassword, userId]);
    } else {
      const sql = `
        UPDATE users
        SET user_firstName = ?, user_lastName = ?, user_email = ?
        WHERE user_id = ?
      `;
      await db.query(sql, [user_firstName, user_lastName, user_email, userId]);
    }

    res.json({ message: "✅ User updated successfully" });
  } catch (error) {
    console.error("❌ Update user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= DELETE USER =========================
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await db.query("DELETE FROM users WHERE user_id = ?", [userId]);
    res.json({ message: "✅ User deleted successfully" });
  } catch (error) {
    console.error("❌ Delete user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= GET ALL ROLES =========================
exports.getRoles = async (req, res) => {
  try {
    const roles = await db.query("SELECT * FROM roles ORDER BY role_id ASC");
    res.json(roles);
  } catch (error) {
    console.error("❌ Error fetching roles:", error);
    res.status(500).json({ message: "Server error fetching roles" });
  }
};
