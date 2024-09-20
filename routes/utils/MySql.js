// routes/utils/MySql.js

const mysql = require('mysql2');
require("dotenv").config();

const config = {
  connectionLimit: 10, // Increased for better scalability
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "ADI_TILTAN123", // Use environment variable
  database: process.env.DB_NAME || "mydb"
};
const pool = mysql.createPool(config);

// Function to execute parameterized queries
const execQuery = (sql, binding = []) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, binding, (err, results, fields) => {
      if (err) {
        console.error("Database Query Error:", err);
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Function to get a connection from the pool
const getConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error getting MySQL connection:", err);
        return reject(err);
      }
      console.log("MySQL pool connected: threadId " + connection.threadId);
      
      const query = (sql, binding = []) => {
        return new Promise((resolve, reject) => {
          connection.query(sql, binding, (err, results) => {
            if (err) {
              console.error("Error executing query:", err);
              return reject(err);
            }
            resolve(results);
          });
        });
      };
      
      const release = () => {
        return new Promise((resolve, reject) => {
          connection.release();
          console.log("MySQL pool released: threadId " + connection.threadId);
          resolve();
        });
      };
      
      resolve({ query, release });
    });
  });
};

module.exports = { pool, getConnection, execQuery };
