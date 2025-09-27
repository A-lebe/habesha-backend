const express = require("express");
const router = express.Router();
const orderController = require("../controller/order.controller");

// Create new order
router.post("/orders", orderController.createOrder);

// Get all orders
router.get("/orders", orderController.getAllOrders);

// Get order by ID
router.get("/orders/:id", orderController.getOrderById);

// Update order
router.put("/orders/:id", orderController.updateOrder);

// Delete order
router.delete("/orders/:id", orderController.deleteOrder);

module.exports = router;

