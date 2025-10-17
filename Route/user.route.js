const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

// ✅ Correct Routes (no duplicate /users)
router.post("/users", userController.registerUser);

router.post("/login", userController.loginUser);
router.get("/", userController.getAllUsers);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
