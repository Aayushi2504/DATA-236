import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  // Fetch books from the backend
  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then((response) => response.json())
      .then((data) => setBooks(data))
      .catch((error) => console.error('Error fetching books:', error));
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Book Management App</h1>
      <h2 className="text-center">Books List</h2>

      <div className="row">
        {books.map((book) => (
          <div className="col-md-4" key={book.id}>
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text"><strong>Author:</strong> {book.author}</p>
                <p className="card-text"><strong>ID:</strong> {book.id}</p>

                <div className="d-grid gap-2">
                  <button className="btn btn-warning" onClick={() => navigate(`/update/${book.id}`)}>
                    Update
                  </button>
                  <button className="btn btn-danger" onClick={() => navigate(`/delete/${book.id}`)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <button className="btn btn-success btn-lg" onClick={() => navigate("/create")}>
          Create Book
        </button>
      </div>
    </div>
  );
};

export default Home;