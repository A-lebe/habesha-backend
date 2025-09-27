const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

// ✅ CRUD Routes
router.post("/users", userController.registerUser);      // Create
router.post("/users/login", userController.loginUser);   // Login
router.get("/users", userController.getAllUsers);        // Read all
router.put("/users/:id", userController.updateUser);     // Update
router.delete("/users/:id", userController.deleteUser);  // Delete

module.exports = router;




