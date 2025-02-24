import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');

  // Fetch the book data to pre-fill the form
  useEffect(() => {
    fetch(`http://localhost:5000/api/books/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setTitle(data.title);
        setAuthor(data.author);
      })
      .catch((error) => console.error('Error fetching book:', error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !author) {
      alert('Title and Author are required');
      return;
    }

    // Send a PUT request to update the book
    fetch(`http://localhost:5000/api/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, author }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Book updated:', data);
        navigate('/'); // Redirect to home page
      })
      .catch((error) => console.error('Error updating book:', error));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Update Book</h2>
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
        <button type="submit" className="btn btn-warning">Update Book</button>
      </form>
    </div>
  );
};

export default UpdateBook;