import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Signup.css'; // Add custom CSS for the signup page

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginCustomer } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !country || !state) {
      setError('All fields are required');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/customer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, country, state }),
      });
      const data = await response.json();
      if (response.ok) {
        // Ensure the backend returns the customer ID
        if (data.customer && data.customer.id) {
          loginCustomer(data.customer.id); // Log in the user after successful signup
          navigate('/restaurants'); // Redirect to restaurants page
        } else {
          setError('Invalid response from server');
        }
      } else {
        // Handle backend validation errors
        setError(data.error || 'Signup failed');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="signup-container">
      <h1>Signup</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="signup-button">
          Signup
        </button>
      </form>
      <p className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;