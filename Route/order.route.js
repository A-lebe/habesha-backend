// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controller/order.controller");

router.post("/orders", orderController.createOrder);
router.get("/orders", orderController.getAllOrders);
router.get("/orders/:id", orderController.getOrderById);
router.put("/orders/:orderId/status", orderController.updateOrderStatus);
router.delete("/orders/:id", orderController.deleteOrder);

module.exports = router;
