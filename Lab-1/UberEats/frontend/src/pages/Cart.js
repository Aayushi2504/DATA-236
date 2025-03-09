import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { viewCart, placeOrder } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Import the CartContext
import { FiTrash2 } from 'react-icons/fi'; 
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { customerId } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const storedCart = localStorage.getItem('cartItems');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        } else {
          const response = await viewCart(customerId);
          setCartItems(response.data);
          localStorage.setItem('cartItems', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [customerId]);
  const handlePlaceOrder = async () => {
    try {
      if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
      }
  
      // Ensure that the restaurant_id is available in the cart items
      const restaurantId = cartItems[0]?.restaurant_id;
      if (!restaurantId) {
        alert('Restaurant ID is missing!');
        return;
      }
  
      // Ensure that the customerId is available
      if (!customerId) {
        alert('Customer ID is missing! Please log in.');
        return;
      }
  
      const orderData = {
        customer_id: customerId,
        restaurant_id: restaurantId,
        status: 'New',
        items: cartItems,
      };
  
      console.log('Sending order data:', JSON.stringify(orderData, null, 2)); // Log data before sending
  
      const response = await placeOrder(orderData);
      console.log('Order response:', response.data);
  
      alert('Order placed successfully!');
      setCartItems([]);
      localStorage.removeItem('cartItems');
  
      window.dispatchEvent(new Event('orderPlaced'));
      navigate('/restaurants');
    } catch (error) {
      console.error('Error placing order:', error.response ? error.response.data : error.message);
      alert(`Failed to place order: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty 🛒</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.name}</h3>
                  <p className="cart-item-price">${Number(item.price).toFixed(2)}</p>
                  <div className="cart-item-quantity">
                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="remove-item-button" onClick={() => handleRemoveItem(item.id)}>
                  <FiTrash2 className="remove-icon" />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Total: ${calculateTotalPrice().toFixed(2)}</h2>
            <button className="place-order-button" onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
