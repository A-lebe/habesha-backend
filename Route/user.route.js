// backend/Route/user.route.js
const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller"); // ✅ Make sure path is correct
// Debug log to check if loginUser is a function
console.log("🧪 loginUser type:", typeof userController.loginUser);

// Register and login
router.post("/users/register", userController.registerUser);
// router.post("/login", userController.loginUser);

// CRUD
router.get("/users", userController.getAllUsers);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
