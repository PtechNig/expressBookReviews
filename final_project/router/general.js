const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios")

const Books = JSON.stringify(books,null, 4)
const userscollection = []





public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} =req.body

  if(!username || !password){
    res.status(400).json({message: "Username and password are required"});
  }
  else {
  const user = {
    username: req.body.username,
    password: req.body.password
  }

  userscollection.push(user);
  console.log(user)
  console.log(userscollection)

  res.status(201).json(
    {
      message: "User created successfully",
      user: user
    }
  )
}
});

//Route to get data from
public_users.get('/api/books', (req, res) => {
  res.json(books);
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Replace the URL with the actual API endpoint you want to fetch data from
    const response = await axios.get('http://localhost:5000/api/books');
    const books = response.data;
    return res.send(books);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: 'Failed to fetch books' });
  }
});

// Get book details based on ISBN
public_users.get('/api/books/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      res.json(book);
    } else {
      res.status(404).send('Book not found');
    }
  } catch (error) {
    console.error('Error serving book data:', error);
    res.status(500).send({ error: 'Failed to serve book data' });
  }
});

// Route using Axios to fetch a single book by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/api/books/${isbn}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching book data with Axios:', error);
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      res.status(500).send({ error: 'No response received from the server' });
    } else {
      res.status(500).send({ error: 'Error in setting up the request' });
    }
  }
});


public_users.get('/api/books/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const matchingBooks = [];

    for (const key in books) {
      if (books[key].author.toLowerCase() === author) {
        matchingBooks.push(books[key]);
      }
    }

    if (matchingBooks.length > 0) {
      res.json(matchingBooks);
    } else {
      res.status(404).send('No books found by that author');
    }
  } catch (error) {
    console.error('Error serving books by author:', error);
    res.status(500).send({ error: 'Failed to serve books by author' });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const response = await axios.get(`http://localhost:5000/api/books/author/${author}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching books by author with Axios:', error);
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      res.status(500).send({ error: 'No response received from the server' });
    } else {
      res.status(500).send({ error: 'Error in setting up the request' });
    }
  }
});

// Get all books based on title
public_users.get('/api/books/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const matchingTitles = [];

    for (const key in books) {
      if (books[key].title.toLowerCase().includes(title)) {
        matchingTitles.push(books[key]);
      }
    }

    if (matchingTitles.length > 0) {
      res.json(matchingTitles);
    } else {
      res.status(404).send('No books found by that title');
    }
  } catch (error) {
    console.error('Error serving books by title:', error);
    res.status(500).send({ error: 'Failed to serve books by title' });
  }
});

// Route using Axios to fetch books by title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const response = await axios.get(`http://localhost:5000/api/books/title/${title}`);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching books by title with Axios:', error);
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      res.status(500).send({ error: 'No response received from the server' });
    } else {
      res.status(500).send({ error: 'Error in setting up the request' });
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.json(book.reviews);
  } else {
    res.status(404).send('No reviews found for this book');
  }
});

module.exports.general = public_users;
