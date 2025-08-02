

const express = require('express');
const app = express();
// const initializeDatabase = require('./config/databaseInit'); // Your DB setup file
const dbPool = require('./db/db.connection'); // Your main DB connection pool

// Load environment variables (make sure .env is in backend folder)
require('dotenv').config({ path: './.env' });

const PORT = process.env.PORT || 3000;
const DATABASE_NAME = process.env.DB_NAME || 'database'; // Get database name for the query

// Middleware
app.use(express.json());
// ... other middleware like CORS, body-parser, etc.

// Connect to the database and initialize it on startup
// initializeDatabase().then(() => {
//   // Database is ready, now start the Express server
//   app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
//     console.log(`Access your app at http://localhost:${PORT}`);
//   });
// }).catch(err => {
//   console.error("Failed to initialize database and start server:", err);
//   process.exit(1); // Exit if DB setup fails
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access your app at http://localhost:${PORT}`);
  });

// --- New Route to Fetch Table Names ---
app.get('/api/tables', (req, res) => {
  const getTableNamesQuery = `SELECT TABLE_NAME FROM information_schema.TABLES WHERE table_schema = '${DATABASE_NAME}'`;

  dbPool.query(getTableNamesQuery, (err, results) => {
    if (err) {
      console.error('Error fetching table names:', err);
      return res.status(500).json({ error: 'Error fetching table names' });
    }

    // Extract table names from the results
    const tableNames = results.map(row => row.TABLE_NAME);
    res.json({ tables: tableNames });
  });
});

// Example route using the dbPool (from previous examples)
app.get('/api/users', (req, res) => {
  dbPool.query('SELECT * FROM users', (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).send('Error fetching users');
    }
    res.json(results);
  });
});

// ... your other routes
