const orderService = require("../services/order.services");

// Create new order
const createOrder = async (req, res) => {
  try {
    const {
      user_id,
      delivery_date,
      habesha_cookies_quantity = 0,
      baklava_quantity = 0,
      almunium_phoil_quantity = 0,
      packaging_type = "small",
      special_instructions = null,
      order_status = "Pending",
      total_price,
    } = req.body;

    // Validation
    if (!user_id || !delivery_date || !total_price) {
      return res.status(400).json({ error: "user_id, delivery_date and total_price are required" });
    }

    const newOrder = await orderService.createOrder({
      user_id,
      delivery_date,
      habesha_cookies_quantity,
      baklava_quantity,
      almunium_phoil_quantity,
      packaging_type,
      special_instructions,
      order_status,
      total_price,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order
const updateOrder = async (req, res) => {
  try {
    const updatedOrder = await orderService.updateOrder(req.params.id, req.body);
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const result = await orderService.deleteOrder(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
