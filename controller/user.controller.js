const userService = require("../services/user.services");

// ✅ Register User
const registerUser = async (req, res) => {
  try {
    const { username, firstname, lastname, email, password } = req.body;

    if (!username || !firstname || !lastname || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const result = await userService.createUser({ username, firstname, lastname, email, password });
    res.status(201).json({ message: "User registered successfully", data: result });
  } catch (error) {
      console.error("error in user registration:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

// ✅ Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const result = await userService.loginUser(email, password);
    if (!result) return res.status(401).json({ error: "Invalid email or password" });

    res.status(200).json({ message: "Login successful", user: result });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Update User
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, firstname, lastname, email, password } = req.body;

    if (!username || !firstname || !lastname || !email) {
      return res.status(400).json({ error: "All fields except password are required" });
    }

    const updated = await userService.updateUser(id, { username, firstname, lastname, email, password });
    if (!updated) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Delete User
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await userService.deleteUser(id);

    if (!deleted) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
