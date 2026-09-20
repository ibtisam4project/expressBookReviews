const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// ==========================================================================
// TASK 6: User Registration
// ==========================================================================
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Unable to register user: username and password must be provided." });
  }

  // Check if username already exists
  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists! Please choose another username." });
  }

  // Register new user
  users.push({ username, password });
  return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
});

// ==========================================================================
// TASK 1 & TASK 10: Get all books using Promise / async-await
// ==========================================================================
public_users.get('/', async function (req, res) {
  try {
    const fetchBooks = () => new Promise((resolve) => {
      resolve(books);
    });

    const bookList = await fetchBooks();
    return res.status(200).send(JSON.stringify(bookList, null, 4));
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
});

// ==========================================================================
// TASK 2 & TASK 11: Get book details based on ISBN using Promise / async-await
// ==========================================================================
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const fetchBookByISBN = (id) => new Promise((resolve, reject) => {
      if (books[id]) {
        resolve(books[id]);
      } else {
        reject(new Error("Book not found"));
      }
    });

    const book = await fetchBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

// ==========================================================================
// TASK 3 & TASK 12: Get book details based on Author using Promise / async-await
// ==========================================================================
public_users.get('/author/:author', async function (req, res) {
  const authorQuery = req.params.author.toLowerCase();

  try {
    const fetchBooksByAuthor = (author) => new Promise((resolve, reject) => {
      const matchingBooks = {};
      const keys = Object.keys(books);

      keys.forEach((key) => {
        if (books[key].author.toLowerCase() === author) {
          matchingBooks[key] = books[key];
        }
      });

      if (Object.keys(matchingBooks).length > 0) {
        resolve(matchingBooks);
      } else {
        reject(new Error("No books found by this author"));
      }
    });

    const authorBooks = await fetchBooksByAuthor(authorQuery);
    return res.status(200).json(authorBooks);
  } catch (error) {
    return res.status(404).json({ message: `No books found by author '${req.params.author}'` });
  }
});

// ==========================================================================
// TASK 4 & TASK 13: Get all books based on Title using Promise / async-await
// ==========================================================================
public_users.get('/title/:title', async function (req, res) {
  const titleQuery = req.params.title.toLowerCase();

  try {
    const fetchBooksByTitle = (title) => new Promise((resolve, reject) => {
      const matchingBooks = {};
      const keys = Object.keys(books);

      keys.forEach((key) => {
        if (books[key].title.toLowerCase() === title) {
          matchingBooks[key] = books[key];
        }
      });

      if (Object.keys(matchingBooks).length > 0) {
        resolve(matchingBooks);
      } else {
        reject(new Error("No books found with this title"));
      }
    });

    const titleBooks = await fetchBooksByTitle(titleQuery);
    return res.status(200).json(titleBooks);
  } catch (error) {
    return res.status(404).json({ message: `No books found with title '${req.params.title}'` });
  }
});

// ==========================================================================
// TASK 5: Get book reviews based on ISBN
// ==========================================================================
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
  }
});

// ==========================================================================
// TASKS 10 - 13: Axios Helper Functions (Async/Await Client Implementations)
// ==========================================================================
const BASE_URL = 'http://localhost:5000';

// Task 10: Get all books using async/await with Axios
async function getAllBooksAxios() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error("Error in getAllBooksAxios:", error.message);
    throw error;
  }
}

// Task 11: Get book by ISBN using async/await with Axios
async function getBookByISBNAxios(isbn) {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getBookByISBNAxios for ISBN ${isbn}:`, error.message);
    throw error;
  }
}

// Task 12: Get books by Author using async/await with Axios
async function getBooksByAuthorAxios(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getBooksByAuthorAxios for author ${author}:`, error.message);
    throw error;
  }
}

// Task 13: Get books by Title using async/await with Axios
async function getBooksByTitleAxios(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    console.error(`Error in getBooksByTitleAxios for title ${title}:`, error.message);
    throw error;
  }
}

module.exports.general = public_users;
module.exports.getAllBooksAxios = getAllBooksAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBooksByAuthorAxios = getBooksByAuthorAxios;
module.exports.getBooksByTitleAxios = getBooksByTitleAxios;
