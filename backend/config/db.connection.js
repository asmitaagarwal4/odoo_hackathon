require("dotenv").config();
const { createPool} = require('mysql2');
const pool = createPool({  
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'database',
    connectionLimit: 10
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL for application:', err.stack);
    return;
  }
  console.log('Connected to MySQL database pool.');
  connection.release(); // Release the connection
});

module.exports = pool;
