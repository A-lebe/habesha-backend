const db = require("../dbconfig/DBconfig");

// Create new order
const createOrder = async (orderData) => {
  const {
    user_id,
    delivery_date,
    habesha_cookies_quantity,
    baklava_quantity,
    almunium_phoil_quantity,
    packaging_type,
    special_instructions,
    order_status,
    total_price,
  } = orderData;

  const sql = `
    INSERT INTO orders (
      user_id, delivery_date, habesha_cookies_quantity, baklava_quantity,
      almunium_phoil_quantity, packaging_type, special_instructions,
      order_status, total_price
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const result = await db.query(sql, [
    user_id,
    delivery_date,
    habesha_cookies_quantity,
    baklava_quantity,
    almunium_phoil_quantity,
    packaging_type,
    special_instructions,
    order_status,
    total_price,
  ]);

  return { order_id: result.insertId, ...orderData };
};

// Get all orders
const getAllOrders = async () => {
  const sql = `SELECT * FROM orders`;
  return await db.query(sql);
};

// Get order by ID
const getOrderById = async (id) => {
  const sql = `SELECT * FROM orders WHERE order_id = ?`;
  const rows = await db.query(sql, [id]);
  return rows[0];
};

// Update order
const updateOrder = async (id, orderData) => {
  const {
    delivery_date,
    habesha_cookies_quantity,
    baklava_quantity,
    almunium_phoil_quantity,
    packaging_type,
    special_instructions,
    order_status,
    total_price,
  } = orderData;

  const sql = `
    UPDATE orders
    SET delivery_date = ?, habesha_cookies_quantity = ?, baklava_quantity = ?,
        almunium_phoil_quantity = ?, packaging_type = ?, special_instructions = ?,
        order_status = ?, total_price = ?
    WHERE order_id = ?
  `;

  await db.query(sql, [
    delivery_date,
    habesha_cookies_quantity,
    baklava_quantity,
    almunium_phoil_quantity,
    packaging_type,
    special_instructions,
    order_status,
    total_price,
    id,
  ]);

  return { order_id: id, ...orderData };
};

// Delete order
const deleteOrder = async (id) => {
  const sql = `DELETE FROM orders WHERE order_id = ?`;
  await db.query(sql, [id]);
  return { message: "Order deleted successfully" };
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};
