const express = require("express");
const router = express.Router();
const userRoutes = require("./user.route");
const bcrypt = require("bcryptjs");
router.use(userRoutes);
module.exports = router;

    