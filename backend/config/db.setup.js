// backend/db.setup.js
const mysql = require('mysql2');

const dbConfigNoDB = {
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  port: process.env.DB_PORT || 3306
};

const setupConnection = mysql.createConnection(dbConfigNoDB);

module.exports = setupConnection;
