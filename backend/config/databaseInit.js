// backend/databaseInit.js

const mysql = require('mysql2'); // Ensure you're using mysql2
const setupConnection = require('./db.setup'); // Connection without specifying database
const databaseName = process.env.DB_NAME || 'database'; // Matches docker run

async function initializeDatabase() {
    try {
        await new Promise((resolve, reject) => {
            setupConnection.connect(err => {
                if (err) return reject(err);
                console.log('Connected to MySQL server for setup.');
                resolve();
            });
        });

        await new Promise((resolve, reject) => {
            setupConnection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseName}\``, (err) => { // Added backticks here
                if (err) return reject(err);
                console.log(`Database '${databaseName}' created or already exists.`);
                resolve();
            });
        });


        // Switch to the created database
        await new Promise((resolve, reject) => {
            setupConnection.changeUser({ database: databaseName }, (err) => {
                if (err) return reject(err);
                console.log(`Switched to database '${databaseName}'.`);
                resolve();
            });
        });

        // Create 'users' table if not exists (no initial data)
        const createUsersTableSql = `
      CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL
      );
    `;

        await new Promise((resolve, reject) => {
            setupConnection.query(createUsersTableSql, (err) => {
                if (err) return reject(err);
                console.log("'users' table created or already exists.");
                resolve();
            });
        });

        console.log('Database setup complete.');

    } catch (error) {
        console.error('Database initialization error:', error.stack);
        process.exit(1);
    } finally {
        if (setupConnection) {
            setupConnection.end(err => {
                if (err) console.error('Error closing setup connection:', err.stack);
                else console.log('Setup connection closed.');
            });
        }
    }
}

// initializeDatabase();

module.exports = initializeDatabase;
