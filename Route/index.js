// backend/Route/index.js
const express = require("express");
const router = express.Router();
const userRoutes = require("./user.route");
const LoginRoute = require('../Route/login.route')
const OrderRoute = require('../Route/order.route')
// All user-related routes
router.use( userRoutes);
router.use(LoginRoute)
router.use(OrderRoute)
module.exports = router;
