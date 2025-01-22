const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8081;

// MySQL configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost', // Use 'mysql-service' for Kubernetes
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'yourpassword',
  database: process.env.DB_NAME || 'yourdatabase',
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    process.exit(1); // Exit if connection fails
  }
  console.log('Connected to MySQL as ID', db.threadId);
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Serve about.html
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, '/about.html'));
});

// Route to test MySQL connection
app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS result', (err, results) => {
    if (err) {
      console.error('Database query error:', err.stack);
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json({ message: 'Database connected successfully!', result: results[0].result });
  });
});

// Example route to fetch data from a table (e.g., "users")
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users'; // Ensure "users" table exists in the database
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err.stack);
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(results);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
