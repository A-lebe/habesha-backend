// controllers/orderController.js
const orderService = require("../services/order.services");

// ================= CREATE ORDER =================
async function createOrder(req, res) {
  try {
    const { order, address } = req.body;

    if (!order || !address) {
      return res.status(400).json({ message: "Missing order or address data" });
    }

    const result = await orderService.createOrder(order, address);
    res.status(201).json({
      message: "Order created successfully",
      orderId: result.orderId,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
}

// ================= GET ALL ORDERS =================
async function getAllOrders(req, res) {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
}

// ================= GET ORDER BY ID =================
async function getOrderById(req, res) {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
}

// ================= UPDATE ORDER STATUS =================
async function updateOrderStatus(req, res) {
  try {
    const { orderId } = req.params;
    const { status } = req.body; // ✅ Must be defined
console.log("🟡 Received status:", status);
    if (!status) {
      return res.status(400).json({ message: "Missing status field" });
    }

    const result = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ updateOrderStatus Error:", error);
    res.status(500).json({ message: error.message });
  }
}
// ================= DELETE ORDER =================
async function deleteOrder(req, res) {
  try {
    const { id } = req.params;
    await orderService.deleteOrder(id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete order" });
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
