require("dotenv").config();
const { createPool } = require('mysql2/promise');
const pool = createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'database',
    connectionLimit: 10
});

module.exports = pool;
