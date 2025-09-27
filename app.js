const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv=require("dotenv")
const app = express();
const port = 1234;
const bcrypt= require("bcryptjs");

// Load route files
const Routes = require("./Route/install.route");
const registerRoute = require("./Route/index");
const orderRoute = require("./Route/order.route")
const updateOrder = require("./Route/order.route")
const deleteOrder = require("./Route/order.route")
const adressRoute = require("./Route/adress.route")
const updateAddress = require("./Route/adress.route")
const deleteAddress = require("./Route/adress.route")     
dotenv.config()
// Middleware Configuration
app.use(cors()); // Enable CORS for all routes

// Body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Security middleware (recommended)
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});

// Mount routes under /API
app.use("/API", Routes);
 app.use("/API", registerRoute);
app.use("/API", adressRoute);
app.use("/API", orderRoute);
app.use("/API", updateOrder);
app.use("/API", deleteOrder); 
app.use("/API", updateAddress);
app.use("/API", deleteAddress);
// Error handling middleware (must be after routes)
// app.js
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);

  const status = err.status || 500;
  res.status(status).json({
    error: err.message || "Something went wrong!"
  });
});

const orderRoutes = require("./Route/order.route");
app.use("/API", orderRoutes);


// 404 handler (last middleware)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start the server
app.listen(port, (error) => {
  if (error) {
    console.error("Server failed to start:", error);
  } else {
    console.log(`✅ Server running on http://localhost:${port}`);
    console.log(`📌 API endpoints available at http://localhost:${port}/API`);
  }
});
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON:', err.message);
    return res.status(400).send({ error: 'Invalid JSON' });
  }
  next();
});

