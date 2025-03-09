import React, { useEffect, useState } from 'react';
import { viewCart, placeOrder } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import './Cart.css'; // Import new styles

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { customerId } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await viewCart(customerId);
        setCartItems(response.data);
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
      const response = await placeOrder({ customer_id: customerId, restaurant_id: 1 });
      alert('Order placed successfully!');
      setCartItems([]); // Clear cart after order
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
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
                  <p className="cart-item-price"> ${Number(item.price).toFixed(2)}</p>
                  <div className="cart-item-quantity">
                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
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
