const bcrypt = require('bcryptjs');

// Signup
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO customers (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, hashedPassword], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Customer registered successfully', customer: { id: result.insertId, name, email } });
  });
};

// Login
exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const sql = 'SELECT * FROM customers WHERE email = ?';
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'Customer not found' });

    const customer = result[0];
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.customerId = customer.id;
    res.json({ message: 'Login successful', customer });
  });
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logout successful' });
  });
};

// Get Profile
exports.getProfile = (req, res) => {
  const { customer_id } = req.params;
  const sql = 'SELECT * FROM customers WHERE id = ?';
  db.query(sql, [customer_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'Customer not found' });
    res.json(result[0]);
  });
};

// Update Profile
exports.updateProfile = (req, res) => {
  const { customer_id } = req.params;
  const { name, profile_picture, country, state } = req.body;
  if (!name && !profile_picture && !country && !state) {
    return res.status(400).json({ error: 'At least one field is required' });
  }
  const sql = 'UPDATE customers SET name = ?, profile_picture = ?, country = ?, state = ? WHERE id = ?';
  db.query(sql, [name, profile_picture, country, state, customer_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Profile updated successfully' });
  });
};

// Get Order History
exports.getOrderHistory = (req, res) => {
  const { customer_id } = req.params;
  const sql = `
    SELECT o.id AS order_id, o.created_at, o.status, o.total, r.name AS restaurant_name, GROUP_CONCAT(d.name SEPARATOR ', ') AS items
    FROM orders o
    JOIN restaurants r ON o.restaurant_id = r.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN dishes d ON oi.dish_id = d.id
    WHERE o.customer_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC;
  `;
  db.query(sql, [customer_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(result);
  });
};

// Add to Favorites
exports.addFavorite = (req, res) => {
  const { customer_id, restaurant_id } = req.body;
  if (!customer_id || !restaurant_id) {
    return res.status(400).json({ error: 'Customer ID and Restaurant ID are required' });
  }
  const sql = 'INSERT INTO favorites (customer_id, restaurant_id) VALUES (?, ?)';
  db.query(sql, [customer_id, restaurant_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ message: 'Restaurant added to favorites' });
  });
};

// Get Favorites
exports.getFavorites = (req, res) => {
  const { customer_id } = req.params;
  const sql = `
    SELECT r.* 
    FROM restaurants r
    JOIN favorites f ON r.id = f.restaurant_id
    WHERE f.customer_id = ?
  `;
  db.query(sql, [customer_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(result);
  });
};

// Remove from Favorites
exports.removeFavorite = (req, res) => {
  const { customer_id, restaurant_id } = req.params;
  const sql = 'DELETE FROM favorites WHERE customer_id = ? AND restaurant_id = ?';
  db.query(sql, [customer_id, restaurant_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Favorite not found' });
    res.json({ message: 'Restaurant removed from favorites' });
  });
};

// View Cart
exports.getCart = (req, res) => {
  const { customer_id } = req.params;
  const sql = `
    SELECT c.*, d.name, d.price, d.image, d.restaurant_id 
    FROM cart c
    JOIN dishes d ON c.dish_id = d.id
    WHERE c.customer_id = ?
  `;
  db.query(sql, [customer_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(result);
  });
};

// Add to Cart
exports.addToCart = (req, res) => {
  const { customer_id, dish_id, quantity } = req.body;
  if (!customer_id || !dish_id || !quantity) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }
  const sql = 'INSERT INTO cart (customer_id, dish_id, quantity) VALUES (?, ?, ?)';
  db.query(sql, [customer_id, dish_id, quantity], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ message: 'Dish added to cart successfully' });
  });
};

// Remove from Cart
exports.removeFromCart = (req, res) => {
  const { cart_id } = req.params;
  const sql = 'DELETE FROM cart WHERE id = ?';
  db.query(sql, [cart_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ message: 'Dish removed from cart successfully' });
  });
};

// Clear Cart
exports.clearCart = (req, res) => {
  const { customer_id } = req.params;
  const sql = 'DELETE FROM cart WHERE customer_id = ?';
  db.query(sql, [customer_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Cart cleared successfully' });
  });
};
