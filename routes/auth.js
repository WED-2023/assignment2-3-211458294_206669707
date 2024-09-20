// routes/auth.js

const express = require("express");
const router = express.Router();
const MySql = require("../routes/utils/MySql"); // Assuming execQuery is exported here
const DButils = require("../routes/utils/MySql"); // Updated to point to MySql.js
const bcrypt = require("bcrypt");
require('dotenv').config(); // Ensure environment variables are loaded

// Path in our API: /users/Register
router.post("/Register", async (req, res, next) => {
  console.log("entered register in backend");
  try {
    // Check if bcrypt_saltRounds is defined
    if (!process.env.bcrypt_saltRounds) {
      console.error("bcrypt_saltRounds is not defined in .env file");
      throw { status: 500, message: "Server configuration error" };
    }

    // Extract user details
    const user_details = {
      username: req.body.username,
      firstName: req.body.firstName, // Changed to match frontend
      lastName: req.body.lastName,   // Changed to match frontend
      country: req.body.country,
      password: req.body.password,
      email: req.body.email,
    };

    console.log("Received registration request:", user_details);

    // Validate required fields
    const requiredFields = ['username', 'firstName', 'lastName', 'country', 'password', 'email'];
    for (const field of requiredFields) {
      if (!user_details[field]) {
        throw { status: 400, message: `${field} is required` };
      }
    }

    // Check if username or email already exists
    const existingUsers = await DButils.execQuery(
      `SELECT username, email FROM users WHERE username = ? OR email = ?`,
      [user_details.username, user_details.email]
    );

    if (existingUsers.length > 0) {
      throw { status: 409, message: "Username or email already taken" };
    }

    // Hash the password
    const hash_password = await bcrypt.hash(user_details.password, parseInt(process.env.bcrypt_saltRounds));

    // Insert the new user using parameterized query
    await DButils.execQuery(
      `INSERT INTO users (username, firstname, lastname, country, password, email) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        user_details.username,
        user_details.firstName,
        user_details.lastName,
        user_details.country,
        hash_password,
        user_details.email
      ]
    );

    res.status(201).send({ message: "User created", success: true });
    console.log("User registered successfully");
  } catch (error) {
    console.log("Error in registering:", error);
    next(error);
  }
});

// Path in our API: /users/Login
router.post("/Login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      throw { status: 400, message: "Username and password are required" };
    }

    // Check that username exists
    const users = await DButils.execQuery(
      `SELECT username, password FROM users WHERE username = ?`,
      [username]
    );

    if (users.length === 0) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    const user = users[0];

    // Check that the password is correct
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // Set session (ensure you have session middleware set up)
    req.session.username = user.username;

    // Return success response
    res.status(200).send({ message: "Login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

// Path in our API: /users/Logout
router.post("/Logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send({ success: false, message: "Logout failed" });
    }
    res.clearCookie('connect.sid'); // Assuming default session cookie name
    res.status(200).send({ success: true, message: "Logout succeeded" });
  });
});

module.exports = router;
