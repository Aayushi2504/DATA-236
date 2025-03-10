import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCustomerProfile, updateCustomerProfile } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country: '',
    state: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getCustomerProfile(id);
        setProfile(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          country: response.data.country,
          state: response.data.state,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async () => {
    try {
      const response = await updateCustomerProfile(id, formData);
      // Update the profile state with the new data
      setProfile((prevProfile) => ({
        ...prevProfile,
        name: formData.name,
        email: formData.email,
        country: formData.country,
        state: formData.state,
      }));
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!profile) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <h1>Profile Not Found</h1>
          </div>
          <div className="profile-body">
            <p>No profile data available.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h1>Profile</h1>
        </div>
        <div className="profile-body">
          {editMode ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Country:</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>State:</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
              <div className="profile-actions">
                <button className="btn-save" onClick={handleSave}>
                  Save
                </button>
                <button className="btn-cancel" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="profile-info">
                <div className="profile-info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{profile.name}</span>
                </div>
                <div className="profile-info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profile.email}</span>
                </div>
                <div className="profile-info-item">
                  <span className="info-label">Country:</span>
                  <span className="info-value">{profile.country}</span>
                </div>
                <div className="profile-info-item">
                  <span className="info-label">State:</span>
                  <span className="info-value">{profile.state}</span>
                </div>
              </div>
              <div className="profile-actions">
                <button className="btn-edit" onClick={() => setEditMode(true)}>
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;