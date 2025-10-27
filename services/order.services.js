// backend/services/order.service.js
const db = require("../dbconfig/DBconfig");

// ========================= CREATE ORDER (WITH ADDRESS) =========================
const createOrder = async (data) => {
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
  } = data;

  const orderSql = `
    INSERT INTO orders (
      user_id, delivery_date, habesha_cookies_quantity, baklava_quantity,
      almunium_phoil_quantity, packaging_type, special_instructions,
      order_status, total_price
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const orderResult = await db.query(orderSql, [
    user_id,
    delivery_date,
    habesha_cookies_quantity || 0,
    baklava_quantity || 0,
    almunium_phoil_quantity || 0,
    packaging_type || "small",
    special_instructions || null,
    order_status || "Pending",
    total_price || 0,
  ]);

  const order_id = orderResult.insertId;

  // ✅ Insert address if provided
  if (address && address.first_name && address.last_name) {
    const addressSql = `
      INSERT INTO addresses (
        order_id, first_name, last_name, phone, email,
        address, address_2, city, state, zip_code, shipping_option
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(addressSql, [
      order_id,
      address.first_name,
      address.last_name,
      address.phone,
      address.email,
      address.address,
      address.address_2 || null,
      address.city,
      address.state,
      address.zip_code,
      address.shipping_option || null,
    ]);
  }

  return { order_id, ...data };
};

// ========================= GET ALL ORDERS (JOIN USER + ADDRESS) =========================
const getAllOrders = async () => {
  const sql = `
    SELECT 
      o.*, 
      u.user_firstName, u.user_lastName, u.user_email,
      a.first_name AS address_firstName, a.last_name AS address_lastName,
      a.phone, a.email AS address_email, a.address, a.city, a.state, a.zip_code
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.user_id
    LEFT JOIN addresses a ON o.order_id = a.order_id
    ORDER BY o.created_at DESC
  `;
  const rows = await db.query(sql);
  return rows;
};

// ========================= GET ORDER BY ID =========================
const getOrderById = async (id) => {
  const sql = `
    SELECT 
      o.*, 
      u.user_firstName, u.user_lastName, u.user_email,
      a.first_name AS address_firstName, a.last_name AS address_lastName,
      a.phone, a.email AS address_email, a.address, a.city, a.state, a.zip_code
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.user_id
    LEFT JOIN addresses a ON o.order_id = a.order_id
    WHERE o.order_id = ?
  `;
  const rows = await db.query(sql, [id]);
  return rows[0];
};

// ========================= UPDATE ORDER (AND ADDRESS IF PRESENT) =========================
const updateOrder = async (id, data) => {
  const {
    delivery_date,
    habesha_cookies_quantity,
    baklava_quantity,
    almunium_phoil_quantity,
    packaging_type,
    special_instructions,
    order_status,
    total_price,
    address,
  } = data;

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

  // ✅ Update address if provided
  if (address && address.first_name && address.last_name) {
    const check = await db.query(`SELECT * FROM addresses WHERE order_id = ?`, [id]);
    if (check[0].length > 0) {
      const updateSql = `
        UPDATE addresses
        SET first_name = ?, last_name = ?, phone = ?, email = ?,
            address = ?, address_2 = ?, city = ?, state = ?, zip_code = ?, shipping_option = ?
        WHERE order_id = ?
      `;
      await db.query(updateSql, [
        address.first_name,
        address.last_name,
        address.phone,
        address.email,
        address.address,
        address.address_2,
        address.city,
        address.state,
        address.zip_code,
        address.shipping_option,
        id,
      ]);
    } else {
      // If no existing address, create new
      const insertSql = `
        INSERT INTO addresses (
          order_id, first_name, last_name, phone, email,
          address, address_2, city, state, zip_code, shipping_option
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      await db.query(insertSql, [
        id,
        address.first_name,
        address.last_name,
        address.phone,
        address.email,
        address.address,
        address.address_2,
        address.city,
        address.state,
        address.zip_code,
        address.shipping_option,
      ]);
    }
  }

  return { order_id: id, ...data };
};

// ========================= UPDATE ONLY STATUS =========================
const updateOrderStatus = async (orderId, status) => {
  const sql = `UPDATE orders SET order_status = ? WHERE order_id = ?`;
  await db.query(sql, [status, orderId]);
  return { order_id: orderId, status };
};

// ========================= DELETE ORDER (AND ADDRESS CASCADE) =========================
const deleteOrder = async (id) => {
  await db.query(`DELETE FROM orders WHERE order_id = ?`, [id]);
  // Addresses are deleted automatically via ON DELETE CASCADE
  return { message: "✅ Order deleted successfully" };
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrder,
};
