const orderService = require("../services/order.services");

// ========================= CREATE ORDER =========================
exports.createOrder = async (req, res) => {
  try {
    const {
      user_id,
      delivery_date,
      habesha_cookies_quantity,
      baklava_quantity,
      almunium_phoil_quantity
,
      packaging_type,
      special_instructions,
      order_status,
      total_price,
      address,
    } = req.body;

    // 🔹 Validate required fields
    if (!user_id || !delivery_date) {
      return res.status(400).json({ message: "Missing required fields: user_id or delivery_date" });
    }

    const order = await orderService.createOrder({
      user_id,
      delivery_date,
      habesha_cookies_quantity: habesha_cookies_quantity || 0,
      baklava_quantity: baklava_quantity || 0,
      almunium_phoil_quantity
: almunium_phoil_quantity
 || 0,
      packaging_type: packaging_type || "small",
      special_instructions: special_instructions || null,
      order_status: order_status || "Pending",
      total_price: total_price || 0,
      address,
    });

    res.status(201).json({
      message: "✅ Order created successfully",
      order,
    });
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= GET ALL ORDERS =========================
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= GET ORDER BY ID =========================
exports.getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= UPDATE ORDER =========================
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await orderService.updateOrder(id, req.body);
    res.json({
      message: "✅ Order updated successfully",
      updatedOrder,
    });
  } catch (error) {
    console.error("❌ Error updating order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= UPDATE ORDER STATUS =========================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: "Missing status field" });

    await orderService.updateOrderStatus(orderId, status);
    res.json({ message: "✅ Order status updated successfully" });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================= DELETE ORDER =========================
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await orderService.deleteOrder(id);
    res.json({ message: "✅ Order deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting order:", error);
    res.status(500).json({ message: "Server error" });
  }
};
