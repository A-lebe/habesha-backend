// services/address.service.js
const db = require("../dbconfig/DBconfig");

// Create Address
const createAddress = async (data) => {
  const sql = `
    INSERT INTO addresses (
      order_id, first_name, last_name, phone, email,
      address, address_2, city, state, zip_code, shipping_option
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    data.order_id,
    data.first_name,
    data.last_name,
    data.phone,
    data.email,
    data.address,
    data.address_2 || null,
    data.city,
    data.state,
    data.zip_code,
    data.shipping_option || null,
  ];
  const result = await db.query(sql, params);
  return { success: true, data: { address_id: result.insertId, ...data } };
};

// Get all addresses
const getAllAddresses = async () => {
  const rows = await db.query("SELECT * FROM addresses", []);
  return { success: true, data: rows };
};

// Get single address
const getAddressById = async (id) => {
  const rows = await db.query("SELECT * FROM addresses WHERE address_id = ?", [id]);
  return { success: true, data: rows[0] || null };
};

// Update address
const updateAddress = async (id, data) => {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(data)) {
    fields.push(`${key}=?`);
    values.push(value || null);
  }
  values.push(id);

  const sql = `UPDATE addresses SET ${fields.join(", ")} WHERE address_id=?`;
  await db.query(sql, values);

  return { success: true, data: { address_id: id, ...data } };
};

// Delete address
const deleteAddress = async (id) => {
  await db.query("DELETE FROM addresses WHERE address_id = ?", [id]);
  return { success: true, message: "Address deleted successfully" };
};

module.exports = {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
