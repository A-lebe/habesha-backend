const mysql2 = require("mysql2/promise");
require("dotenv").config();

let dbConnection;

try {
  dbConnection = mysql2.createPool({
    user: process.env.DB_USER,
    database: process.env.DATABASE,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("✅ Database pool created successfully");
} catch (error) {
  console.error("❌ Failed to create DB connection pool:", error.message);
}

async function query(sql, params) {
  console.log("🟡 Running SQL:", sql, params);
  try {
    const [rows] = await dbConnection.execute(sql, params);
    console.log("🟢 Query success");
    return rows;
  } catch (error) {
    console.error("❌ DB Query Error:", error);
    throw error;
  }
}



module.exports = { query };
