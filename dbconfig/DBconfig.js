// backend/config/db.js
const mysql = require("mysql2/promise");
require("dotenv").config();

let pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DATABASE,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  console.log("✅ Database pool created successfully");
} catch (error) {
  console.error("❌ Failed to create DB connection pool:", error.message);
  process.exit(1);
}

/**
 * Runs an SQL query with parameters and returns the rows.
 * @param {string} sql - The SQL query string.
 * @param {Array} params - The parameters to use in the query.
 * @returns {Promise<Array>} - The result rows.
 */
async function query(sql, params) {
  console.log("🟡 Running SQL:", sql, params);
  try {
    const [rows] = await pool.execute(sql, params);
    console.log("🟢 Query success");
    return rows;
  } catch (error) {
    console.error("❌ DB Query Error:", error.message);
    throw error;
  }
}

module.exports = { pool, query };
