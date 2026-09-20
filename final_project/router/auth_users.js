const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username already exists
const isValid = (username) => {
  const matchingUsers = users.filter((user) => user.username === username);
  return matchingUsers.length === 0;
};

// Check if username and password match records
const authenticatedUser = (username, password) => {
  const matchingUsers = users.filter((user) => user.username === username && user.password === password);
  return matchingUsers.length > 0;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Error logging in: username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    // Generate JWT Access Token
    const accessToken = jwt.sign({ username: username }, 'access', { expiresIn: 60 * 60 });

    // Store in session
    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).send("Customer successfully logged in");
  } else {
    return res.status(401).json({ message: "Invalid login credentials. Check username and password" });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review || req.body.review;
  const username = req.session.authorization ? req.session.authorization.username : (req.user ? req.user.username : null);

  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).send(`The review for the book with ISBN ${isbn} has been added/updated.`);
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

// Delete a book review added by the logged-in user
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization ? req.session.authorization.username : (req.user ? req.user.username : null);

  if (!username) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`);
  } else {
    return res.status(404).json({ message: `No review found for user ${username} on book with ISBN ${isbn}` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
