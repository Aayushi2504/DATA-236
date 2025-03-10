import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaShoppingCart, FaHeart, FaUserCircle, FaSignOutAlt, FaCaretDown } from 'react-icons/fa';
import './Navbar.css'; // Create this file for responsive navbar styles

const Navbar = () => {
  const { customerId, isLoggedIn, logout, isRestaurant } = useAuth();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);

  const isHomePage = location.pathname === '/';
  const isRestaurantSpecificPage = location.pathname.startsWith('/restaurant-') || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/manage-');

  const navbarStyles = {
    backgroundColor: isHomePage ? 'white' : '#FF6600',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const logoStyles = {
    fontSize: '24px', // Smaller font size for mobile
    fontWeight: 'bold',
    color: isHomePage ? '#FF6600' : 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'flex-end',
    gap: '8px',
  };

  const subtextStyles = {
    fontSize: '14px', // Smaller font size for mobile
    color: isHomePage ? '#FF6600' : 'white',
    marginBottom: '4px',
  };

  const linkStyles = {
    textDecoration: 'none',
    color: isHomePage ? '#333' : 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const logoutButtonStyles = {
    background: 'none',
    border: 'none',
    color: isHomePage ? '#333' : 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
  };

  // Render different navbar for restaurant users
  if (isRestaurantSpecificPage || isRestaurant) {
    return (
      <nav style={navbarStyles}>
        <Link to="/" style={logoStyles}>
          TastyEATS
          <span style={subtextStyles}>for restaurants</span>
        </Link>
        <div style={styles.navLinks}>
          {isLoggedIn && (
            <button onClick={logout} style={logoutButtonStyles}>
              <FaSignOutAlt style={styles.icon} /> Logout
            </button>
          )}
        </div>
      </nav>
    );
  }

  // Default navbar for customers
  return (
    <nav style={navbarStyles}>
      <Link to="/" style={logoStyles}>
        TastyEATS
      </Link>
      <div style={styles.navLinks}>
        {isLoggedIn ? (
          <>
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ ...linkStyles, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <FaUserCircle style={styles.icon} /> Profile <FaCaretDown />
              </button>
              {showDropdown && (
                <div style={styles.dropdown}>
                  <Link to={`/profile/${customerId}`} style={styles.dropdownLink}>My Profile</Link>
                  <Link to="/orders" style={styles.dropdownLink}>My Orders</Link>
                </div>
              )}
            </div>
            <Link to="/cart" style={linkStyles}>
              <FaShoppingCart style={styles.icon} /> Cart
            </Link>
            <Link to="/favorites" style={linkStyles}>
              <FaHeart style={styles.icon} /> Favorites
            </Link>
            <button onClick={logout} style={logoutButtonStyles}>
              <FaSignOutAlt style={styles.icon} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyles}>Login</Link>
            <Link to="/signup" style={linkStyles}>Signup</Link>
            <Link to="/restaurant-auth" style={linkStyles}>For Restaurants</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navLinks: {
    display: 'flex',
    gap: '10px', // Smaller gap for mobile
    alignItems: 'center',
  },
  icon: {
    fontSize: '18px', // Smaller icon size for mobile
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  dropdownLink: {
    textDecoration: 'none',
    color: '#333',
    fontSize: '14px',
  },
};

export default Navbar;
