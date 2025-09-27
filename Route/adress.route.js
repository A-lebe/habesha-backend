// routes/address.route.js
const express = require("express");
const router = express.Router();
const addressController = require("../controller/Adress.controller");

// CRUD routes
router.post("/addresses", addressController.createAddress);
router.get("/addresses", addressController.getAllAddresses);
router.get("/addresses/:id", addressController.getAddressById);
router.put("/addresses/:id", addressController.updateAddress);
router.delete("/addresses/:id", addressController.deleteAddress);

module.exports = router;
