const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
})

// Connect to the database
pool
  .connect()
  .then(() => {
    console.log("Connected to the database");

    // SQL query to create a table
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS user_table (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      contact VARCHAR(20),
      email VARCHAR(255),
      password VARCHAR(100)
    );
  `;

    // Execute the query
    return pool.query(createTableQuery);
  })
  .then(() => {
    console.log("Table created successfully");
  })
  .catch((err) => {
    console.error("Error executing query", err.stack);
  });

module.exports = pool;
