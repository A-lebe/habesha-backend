// controllers/address.controller.js
const addressService = require("../services/adress.services");

// Create new address
const createAddress = async (req, res, next) => {
  try {
    const { order_id, first_name, last_name, phone, email, address, city, state, zip_code } = req.body;

    if (!order_id || !first_name || !last_name || !phone || !email || !address || !city || !state || !zip_code) {
      return res.status(400).json({ success: false, error: "Required fields missing" });
    }

    const result = await addressService.createAddress(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

// Get all addresses
const getAllAddresses = async (req, res, next) => {
  try {
    const result = await addressService.getAllAddresses();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Get address by ID
const getAddressById = async (req, res, next) => {
  try {
    const result = await addressService.getAddressById(req.params.id);
    if (!result.data) return res.status(404).json({ success: false, error: "Address not found" });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Update address
const updateAddress = async (req, res, next) => {
  try {
    const result = await addressService.updateAddress(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// Delete address
const deleteAddress = async (req, res, next) => {
  try {
    const result = await addressService.deleteAddress(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};
