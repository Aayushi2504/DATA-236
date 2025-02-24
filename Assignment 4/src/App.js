import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/home';
import CreateBook from './components/Create/CreateBook';
import UpdateBook from './components/Update/UpdateBook';
import DeleteBook from './components/Delete/DeleteBook';
import './App.css';

const App = () => {
  const [books, setBooks] = useState([]);

  // Fetch books from the backend
  useEffect(() => {
    fetch('http://localhost:5000/api/books') 
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  // Add a new book
  const addBook = (newBook) => {
    fetch('http://localhost:5000/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    })
      .then((response) => response.json())
      .then((data) => setBooks([...books, data]))
      .catch((error) => console.error('Error adding book:', error));
  };

  // Update a book
  const updateBook = (id, updatedBook) => {
    fetch(`http://localhost:5000/api/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedBook),
    })
      .then((response) => response.json())
      .then((data) => {
        setBooks(books.map((book) => (book.id === id ? data : book)));
      })
      .catch((error) => console.error('Error updating book:', error));
  };

  // Delete a book
  const deleteBook = (id) => {
    fetch(`http://localhost:5000/api/books/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
      })
      .catch((error) => console.error('Error deleting book:', error));
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home books={books} />} />
          <Route path="/create" element={<CreateBook addBook={addBook} />} />
          <Route path="/update" element={<UpdateBook books={books} updateBook={updateBook} />} />
          <Route path="/delete" element={<DeleteBook books={books} deleteBook={deleteBook} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
