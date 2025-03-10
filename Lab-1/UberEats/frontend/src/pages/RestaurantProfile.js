import React, { useState, useEffect } from 'react';
import { getRestaurantProfile, updateRestaurantProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const RestaurantProfile = () => {
  const { restaurantId } = useAuth();
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [images, setImages] = useState('');
  const [timings, setTimings] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Use useNavigate for redirection

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getRestaurantProfile(restaurantId);
        const { name, location, description, contact_info, images, timings } = response.data;
        setName(name);
        setLocation(location);
        setDescription(description);
        setContactInfo(contact_info);
        setImages(images);
        setTimings(timings);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [restaurantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateRestaurantProfile(restaurantId, { name, location, description, contact_info: contactInfo, images, timings });
      alert('Profile updated successfully!');
      navigate('/restaurant-dashboard'); // Redirect to dashboard after update
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mt-4">
      <h1>Update Restaurant Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="location" className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contactInfo" className="form-label">Contact Info</label>
          <input
            type="text"
            className="form-control"
            id="contactInfo"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="images" className="form-label">Images URL</label>
          <input
            type="text"
            className="form-control"
            id="images"
            value={images}
            onChange={(e) => setImages(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="timings" className="form-label">Timings</label>
          <input
            type="text"
            className="form-control"
            id="timings"
            value={timings}
            onChange={(e) => setTimings(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
    </div>
  );
};

export default RestaurantProfile;