import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = () => {
    if (!id) {
      alert('Book ID is required');
      return;
    }

    // Send a DELETE request to delete the book
    fetch(`http://localhost:5000/api/books/${id}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Book deleted:', data);
        navigate('/'); // Redirect to home page
      })
      .catch((error) => console.error('Error deleting book:', error));
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center">Delete Book</h2>
      <div className="text-center">
        <p>Are you sure you want to delete this book?</p>
        <button className="btn btn-danger" onClick={handleDelete}>
          Delete Book
        </button>
      </div>
    </div>
  );
};

export default DeleteBook;