const mysql2 = require("mysql2/promise");
require("dotenv").config();


// Connection Pool (best practice for concurrency)
const dbConnection = mysql2.createPool({
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
// module.exports = pool;
// Reusable query function
async function query(sql, params) {
  const [rows] = await dbConnection.execute(sql, params);
  return rows;
}



module.exports = { query  };
