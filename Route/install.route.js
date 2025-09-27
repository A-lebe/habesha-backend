

const express = require("express");
const router = express.Router();
const installController = require("../controller/install.controller");

router.get("/install", installController.install); // So this maps to /API/install

module.exports = router;