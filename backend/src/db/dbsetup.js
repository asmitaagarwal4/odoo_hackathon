const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * Parses a string of SQL text into an array of individual, executable statements.
 * @param {string} sqlText - The raw SQL text from a file.
 * @returns {string[]} An array of SQL statements.
 */
const parseSqlStatements = (sqlText) => {
  return sqlText
    // Remove comments
    .replace(/--.*$/gm, '') 
    // Split by semicolon
    .split(';') 
    // Trim whitespace from each statement
    .map(statement => statement.trim()) 
    // Filter out any empty statements that might result from the split
    .filter(statement => statement.length > 0); 
};


/**
 * Sets up the database schema by connecting to MySQL, creating the database,
 * and then executing each table creation and insert statement from the schema file.
 */
const setupSchema = async () => {
  console.log('🚀 Starting database schema setup...');
  let connection;

  // --- Step 1: Read and parse the SQL file ---
  const sqlFilePath = path.join(__dirname, '..', '/db/schema.sql');
  if (!fs.existsSync(sqlFilePath)) {
      console.error(`❌ SQL file not found at: ${sqlFilePath}`);
      return false;
  }
  const sqlFileContent = fs.readFileSync(sqlFilePath, 'utf8');
  const statements = parseSqlStatements(sqlFileContent);

  // Use the database name from the .env file
  const dbName = process.env.DB_NAME || 'database'; // Use DB_NAME from .env, with a fallback
  const createDbStatement = `CREATE DATABASE IF NOT EXISTS \`${dbName}\``;
  const tableAndInsertStatements = statements.filter(
    stmt => !stmt.toUpperCase().startsWith('CREATE DATABASE') && !stmt.toUpperCase().startsWith('USE')
  );

  try {
    // --- Step 2: Connect to the MySQL server (without a specific database) ---
    console.log('Connecting to MySQL server...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER||'root',
      password: process.env.DB_PASSWORD||'root',
    });
    console.log('✅ Connection successful.');

    // --- Step 3: Create the database ---
    // console.log(`Executing: ${createDbStatement}`);
    await connection.query(createDbStatement);
    console.log(`Database "${dbName}" created or already exists.`);

    // --- Step 4: Switch to the newly created database ---
    await connection.changeUser({ database: dbName });
    console.log(`Switched to database "${dbName}".`);

    // --- Step 5: Execute all other statements (tables, inserts) one by one ---
    console.log('Executing remaining statements...');
    for (const statement of tableAndInsertStatements) {
      console.log(` -> Executing: ${statement.substring(0, 50)}...`);
      await connection.query(statement);
    }

    console.log('Database schema setup complete.');
    return true;

  } catch (error) {
    console.error('Error during database schema setup:', error.message);
    // Log the full error for debugging if needed
    // console.error(error);
    return false;

  } finally {
    // --- Step 6: Ensure the connection is always closed ---
    if (connection) {
      await connection.end();
      console.log('🔌 Setup connection closed.');
    }
  }
};

// This allows the script to be run directly from the command line
// e.g., `node setupSchema.js`
if (require.main === module) {
  setupSchema();
}

module.exports = setupSchema;