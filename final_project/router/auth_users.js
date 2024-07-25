const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const SECRET_KEY = 'your_jwt_secret_key'; // Replace with your actual secret key

const isValid = (username) => {
  // Check if the username is already taken
  return users.some(user => user.username === username);
}

const addUser = (username, password) => {
  if (isValid(username)) {
    return false; // Username already exists
  } else {
    users.push({ username, password });
    return true; // User added successfully
  }
}

const authenticatedUser = (username, password) => {
  // Check if username and password match the one we have in records
  return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

  res.status(200).json({
    message: "Login successful",
    token
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header
  const username = getUsernameFromToken(token);

  if (!username) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { review } = req.query;
  const { isbn } = req.params;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Initialize reviews for the ISBN if not present
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or modify the review for the given ISBN
  books[isbn].reviews[username] = review;

  res.status(200).json({
    message: "Review added/updated successfully",
    book: books[isbn]
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.addUser = addUser;