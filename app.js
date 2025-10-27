// backend/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan"); // 📜 For request logging
const helmet = require("helmet"); // 🛡️ For security headers

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(helmet());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev")); // Log requests in dev mode
}

// ✅ Import Routes

const routes = require("./Route/index");

// ✅ Core API Routes
app.use("/api", routes);

// ✅ Direct user routes (for convenience or testing)
const userRouter = express.Router();

// Register user


// Login user




// ✅ Root route (Health check)
app.get("/", (req, res) => {
  res.status(200).send("🍪 Habesha Cookies API is running...");
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on the server",
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
