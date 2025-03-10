import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RestaurantAuth.css'; // Use a custom CSS file for restaurant auth

const RestaurantAuth = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [images, setImages] = useState('');
  const [timings, setTimings] = useState('');
  const [hasAccount, setHasAccount] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { loginRestaurant } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!email || !password || (!hasAccount && (!name || !location))) {
      setError('Required fields are missing');
      return;
    }
    try {
      const endpoint = hasAccount ? '/api/restaurant/login' : '/api/restaurant/signup';
      const body = hasAccount ? { email, password } : { name, email, password, location, description, contact_info: contactInfo, images, timings };
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        loginRestaurant(data.restaurant.id);
        navigate('/restaurant-dashboard');
      } else {
        setError(data.error || (hasAccount ? 'Login failed' : 'Signup failed'));
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="restaurant-auth-container">
      <div className="restaurant-auth-box">
        <h1>{hasAccount ? 'Restaurant Login' : 'Restaurant Signup'}</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleAuth}>
          {!hasAccount && (
            <>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="contactInfo">Contact Info</label>
                <input type="text" id="contactInfo" value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="images">Images URL</label>
                <input type="text" id="images" value={images} onChange={(e) => setImages(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="timings">Timings</label>
                <input type="text" id="timings" value={timings} onChange={(e) => setTimings(e.target.value)} />
              </div>
            </>
          )}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="auth-button">
            {hasAccount ? 'Login' : 'Signup'}
          </button>
        </form>
        <p className="toggle-link">
          {hasAccount ? 'New to UberEATS? ' : 'Already have an account? '}
          <button onClick={() => setHasAccount(!hasAccount)} className="toggle-button">
            {hasAccount ? 'Signup' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default RestaurantAuth;