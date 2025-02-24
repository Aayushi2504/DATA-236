// routes/book.routes.js
const express = require('express');
const bookController = require('../controllers/book.controller');

const router = express.Router();

// Get all books
router.get('/books', bookController.getAllBooks);

// Get a book by ID
router.get('/books/:id', bookController.getBookById);

// Create a new book
router.post('/books', bookController.createBook);

// Update a book
router.put('/books/:id', bookController.updateBook);

// Delete a book
router.delete('/books/:id', bookController.deleteBook);

module.exports = router;
