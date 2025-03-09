import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import './RestaurantDashboard.css';

const RestaurantDashboard = () => {
  const { restaurantId } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantResponse, dishesResponse, ordersResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/restaurant/profile/${restaurantId}`),
          fetch(`http://localhost:5000/api/restaurant/dishes/${restaurantId}`),
          fetch(`http://localhost:5000/api/restaurant/orders/${restaurantId}`)
        ]);

        const [restaurantData, dishesData, ordersData] = await Promise.all([
          restaurantResponse.json(),
          dishesResponse.json(),
          ordersResponse.json()
        ]);

        setRestaurant(restaurantData);
        setDishes(dishesData);
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteDish = async (dishId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/restaurant/dishes/${dishId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete dish');
      }

      setDishes(dishes.filter(dish => dish.id !== dishId));
    } catch (error) {
      console.error('Error deleting dish:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="restaurant-dashboard-container">
      <h1>Welcome, {restaurant.name}</h1>

      {/* Orders Section */}
      <section className="orders-section">
        <h2>Orders</h2>
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <h3>Order #{order.id}</h3>
              <p>Status: {order.status}</p>
              <select
                value={order.status}
                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
              >
                <option value="New">New</option>
                <option value="Preparing">Preparing</option>
                <option value="On the Way">On the Way</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))}
        </div>
      </section>

      {/* Dishes Section */}
      <section className="dishes-section">
        <div className="dishes-header">
          <h2>Dishes</h2>
          <button className="add-dish-button" onClick={() => navigate('/add-dish')}>
            Add New Dish
          </button>
        </div>
        <div className="dishes-grid">
          {dishes.map((dish) => (
            <div key={dish.id} className="dish-card">
              <img src={dish.image} alt={dish.name} />
              <h3>{dish.name}</h3>
              <p>{dish.description}</p>
              <p>${Number(dish.price).toFixed(2)}</p>
              <div className="dish-buttons">
                <button onClick={() => navigate(`/edit-dish/${dish.id}`)}>Edit</button>
                <button onClick={() => handleDeleteDish(dish.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Restaurant Info Section */}
      <section className="restaurant-info-section">
        <h2>Restaurant Info</h2>
        <p>{restaurant.description}</p>
        <p><strong>Location:</strong> {restaurant.location}</p>
        <p><strong>Contact Info:</strong> {restaurant.contact_info}</p>
        <p><strong>Timings:</strong> {restaurant.timings}</p>
        <button onClick={() => navigate('/edit-profile')}>Edit Profile</button>
      </section>
    </div>
  );
};

export default RestaurantDashboard;
