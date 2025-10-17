const db = require("../dbconfig/DBconfig");

// ============================================================
// 🟩 CREATE ORDER (with address)
// ============================================================
async function createOrder(orderData, addressData) {
  try {
    const {
      user_id,
      delivery_date,
      habesha_cookies_quantity,
      baklava_quantity,
      almunium_phoil_quantity,
      packaging_type,
      special_instructions,
      total_price,
    } = orderData;

    // 1️⃣ Insert Order
    const orderSql = `
      INSERT INTO orders (
        user_id, delivery_date, habesha_cookies_quantity, baklava_quantity,
        almunium_phoil_quantity, packaging_type, special_instructions, total_price
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [orderResult] = await db.query(orderSql, [
      user_id,
      delivery_date,
      habesha_cookies_quantity,
      baklava_quantity,
      almunium_phoil_quantity,
      packaging_type,
      special_instructions,
      total_price,
    ]);

    const orderId = orderResult.insertId;

    // 2️⃣ Insert Address
    const {
      first_name,
      last_name,
      phone,
      email,
      address,
      address_2,
      city,
      state,
      zip_code,
      shipping_option,
    } = addressData;

    const addressSql = `
      INSERT INTO addresses (
        order_id, first_name, last_name, phone, email,
        address, address_2, city, state, zip_code, shipping_option
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(addressSql, [
      orderId,
      first_name,
      last_name,
      phone,
      email,
      address,
      address_2,
      city,
      state,
      zip_code,
      shipping_option,
    ]);

    return { message: "✅ Order created successfully", orderId };
  } catch (error) {
    console.error("❌ createOrder Error:", error);
    throw new Error("Failed to create order");
  }
}

// ============================================================
// 🟨 GET ALL ORDERS
// ============================================================
async function getAllOrders() {
  try {
    const sql = `
      SELECT 
        o.order_id,
        o.user_id,
        o.order_status,
        o.delivery_date,
        o.habesha_cookies_quantity,
        o.baklava_quantity,
        o.almunium_phoil_quantity,
        o.packaging_type,
        o.special_instructions,
        o.total_price,
        o.created_at,
        o.updated_at,
        a.first_name,
        a.last_name,
        a.phone,
        a.email,
        a.address,
        a.address_2,
        a.city,
        a.state,
        a.zip_code,
        a.shipping_option
      FROM orders o
      LEFT JOIN addresses a ON o.order_id = a.order_id
      ORDER BY o.created_at DESC
    `;

    const rows = await db.query(sql);
    return rows;
  } catch (error) {
    console.error("❌ getAllOrders Error:", error);
    throw new Error("Failed to fetch orders");
  }
}

// ============================================================
// 🟦 GET ORDER BY ID
// ============================================================
async function getOrderById(orderId) {
  try {
    const sql = `
      SELECT 
        o.order_id,
        o.user_id,
        o.order_status,
        o.delivery_date,
        o.habesha_cookies_quantity,
        o.baklava_quantity,
        o.almunium_phoil_quantity,
        o.packaging_type,
        o.special_instructions,
        o.total_price,
        o.created_at,
        o.updated_at,
        a.first_name,
        a.last_name,
        a.phone,
        a.email,
        a.address,
        a.address_2,
        a.city,
        a.state,
        a.zip_code,
        a.shipping_option
      FROM orders o
      LEFT JOIN addresses a ON o.order_id = a.order_id
      WHERE o.order_id = ?
    `;

    const [rows] = await db.query(sql, [orderId]);
    return rows[0] || null;
  } catch (error) {
    console.error("❌ getOrderById Error:", error);
    throw new Error("Failed to fetch order");
  }
}

// ============================================================
// 🟧 UPDATE ORDER STATUS
// ============================================================
async function updateOrderStatus(orderId, status) {
  try {
    if (!orderId || !status) {
      throw new Error("Order ID or Status is missing");
    }

    const validStatuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid order status value");
    }

    const result = await db.query(
      `UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?`,
      [status, orderId]
    );

    if (result.affectedRows === 0) {
      throw new Error(`Order with ID ${orderId} not found`);
    }

    // Return updated order info
    const [rows] = await db.query(
      `SELECT order_id, order_status, updated_at FROM orders WHERE order_id = ?`,
      [orderId]
    );

    return {
      message: "✅ Order status updated successfully",
      updatedOrder: rows[0],
    };
  } catch (error) {
    console.error("❌ updateOrderStatus Error:", error.message);
    throw new Error("Failed to update order status");
  }
}

// ============================================================
// 🟥 DELETE ORDER
// ============================================================
async function deleteOrder(orderId) {
  try {
    // Delete address first (foreign key dependency)
    await db.query(`DELETE FROM addresses WHERE order_id = ?`, [orderId]);

    // Delete the order
    const [result] = await db.query(`DELETE FROM orders WHERE order_id = ?`, [orderId]);

    if (result.affectedRows === 0) {
      throw new Error("Order not found");
    }

    return { message: "🗑️ Order deleted successfully" };
  } catch (error) {
    console.error("❌ deleteOrder Error:", error);
    throw new Error("Failed to delete order");
  }
}

// ============================================================
// ✅ EXPORT FUNCTIONS
// ============================================================
module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
