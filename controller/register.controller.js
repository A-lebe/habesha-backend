// backend/controller/register.controller.js
const bcrypt = require("bcryptjs");
const userService = require("../services/user.services");

// Create new user
async function createUser(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;

    const userExists = await userService.findUserByEmail(email);
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await userService.createUser(firstName, lastName, email, hashedPassword);

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: newUser,
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get user by ID
async function getUserById(req, res) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get all users
async function getAllUsers(req, res) {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({ status: "success", data: users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Update user
async function updateUser(req, res) {
  try {
    const { firstName, lastName, email } = req.body;
    const updated = await userService.updateUser(req.params.id, firstName, lastName, email);

    if (updated.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    res.status(200).json({ status: "success", message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Delete user
async function deleteUser(req, res) {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (deleted.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });

    res.status(200).json({ status: "success", message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get roles
async function getRoles(req, res) {
  try {
    const roles = await userService.getAllRoles();
    res.status(200).json({ status: "success", data: roles });
  } catch (err) {
    console.error("Error fetching roles:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  getRoles,
};
