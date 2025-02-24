import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author) {
      alert('Title and Author are required');
      return;
    }

    // Send a POST request to add a new book
    fetch('http://localhost:5000/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, author }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Book added:', data);
        navigate('/'); // Redirect to home page
      })
      .catch((error) => console.error('Error adding book:', error));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Add New Book</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Book Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            placeholder="Enter book title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="author" className="form-label">Author Name</label>
          <input
            type="text"
            className="form-control"
            id="author"
            placeholder="Enter author name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-success">Add Book</button>
      </form>
    </div>
  );
};

export default CreateBook;
