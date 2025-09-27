const express = require("express");
const router = express.Router();
const userController = require("../controller/register.controller");

// Create a new user
router.post("/create", userController.createUser);

// Get a user by ID
router.get("/users/:id", userController.getUserById);

// Get all users
router.get("/users", userController.getAllUsers);

// Update a user by ID
router.put("/users/:id", userController.updateUser);

// Delete a user by ID
router.delete("/users/:id", userController.deleteUser);
// get all user roles
// Define the route for fetching roles
router.get("/roles", userController.getRoles);
module.exports = router;
