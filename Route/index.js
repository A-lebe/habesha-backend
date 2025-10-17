const express = require("express");
const router = express.Router();
const userRoutes = require("./user.route");
const order = require("./order.route");
router.use(userRoutes);
router.use(order);
module.exports = router;

    