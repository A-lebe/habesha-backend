// backend/Route/order.routes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controller/order.controller");

// ✅ Create new order (with optional address)
router.post("/orders", orderController.createOrder);

// ✅ Get all orders (includes user + address info)
router.get("/orders", orderController.getAllOrders);

// ✅ Get single order by ID
router.get("/orders/:id", orderController.getOrderById);

// ✅ Update order (order details + address)
router.put("/orders/:id", orderController.updateOrder);

// ✅ Update only order status (e.g., Approved, Shipped, Delivered)
router.put("/orders/:orderId/status", orderController.updateOrderStatus);

// ✅ Delete order
router.delete("/orders/:id", orderController.deleteOrder);

module.exports = router;
