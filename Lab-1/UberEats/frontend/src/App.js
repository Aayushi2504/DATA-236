import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Restaurant from './pages/Restaurant';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Signup from './pages/Signup';
import RestaurantAuth from './pages/RestaurantAuth';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import RestaurantDashboard from './pages/RestaurantDashboard';
import UpdateProfile from './pages/UpdateProfile';
import ManageDishes from './pages/ManageDishes';
import ManageOrders from './pages/ManageOrders';
import Favorites from './pages/Favorites';
import RestaurantList from './pages/RestaurantList';

// Create a new component to handle the footer logic
const AppContent = () => {
  const location = useLocation();
  const hideFooterPaths = ['/login', '/signup', '/restaurant-auth'];

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<Restaurant />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/restaurant-auth" element={<RestaurantAuth />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} /> {/* Added this route */}
        <Route path="/dashboard" element={<RestaurantDashboard />} /> {/* Optional: Keep this if needed */}
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/manage-dishes" element={<ManageDishes />} />
        <Route path="/manage-orders" element={<ManageOrders />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/restaurants" element={<RestaurantList />} />
      </Routes>
      {!hideFooterPaths.includes(location.pathname) && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
};

export default App;
