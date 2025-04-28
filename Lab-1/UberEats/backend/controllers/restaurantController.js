const bcrypt = require('bcryptjs');

// Signup
exports.signup = async (req, res) => {
  const { name, email, password, location, description, contact_info, images, timings } = req.body;
  if (!name || !email || !password || !location) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO restaurants (name, email, password, location, description, contact_info, images, timings) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, email, hashedPassword, location, description, contact_info, images, timings], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'Email already exists' });
      }
      return res.status(500).json({ error: 'Database error' });
    }
    res.status(201).json({ message: 'Restaurant registered successfully', restaurant: { id: result.insertId, name, email } });
  });
};

// Login
exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const sql = 'SELECT * FROM restaurants WHERE email = ?';
  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'Restaurant not found' });

    const restaurant = result[0];
    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    req.session.restaurantId = restaurant.id;
    res.json({ message: 'Login successful', restaurant: { id: restaurant.id, name: restaurant.name, email: restaurant.email } });
  });
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ message: 'Logout successful' });
  });
};

// View Profile
exports.getProfile = (req, res) => {
  const { restaurant_id } = req.params;
  const sql = 'SELECT * FROM restaurants WHERE id = ?';
  db.query(sql, [restaurant_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'Restaurant not found' });
    res.json(result[0]);
  });
};

// Update Profile
exports.updateProfile = (req, res) => {
  const { restaurant_id } = req.params;
  const { name, location, description, contact_info, images, timings } = req.body;
  if (!name && !location && !description && !contact_info && !images && !timings) {
    return res.status(400).json({ error: 'At least one field is required' });
  }
  const sql = 'UPDATE restaurants SET name = ?, location = ?, description = ?, contact_info = ?, images = ?, timings = ? WHERE id = ?';
  db.query(sql, [name, location, description, contact_info, images, timings, restaurant_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Profile updated successfully' });
  });
};

// Delete Profile
exports.deleteProfile = (req, res) => {
  const { restaurant_id } = req.params;
  const sql = 'DELETE FROM restaurants WHERE id = ?';
  db.query(sql, [restaurant_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Restaurant not found' });
    res.json({ message: 'Restaurant profile deleted successfully' });
  });
};

// Add Dish
exports.addDish = (req, res) => {
  const { restaurant_id, name, ingredients, image, price, description, category } = req.body;
  if (!restaurant_id || !name || !price || !category) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }
  const sql = 'INSERT INTO dishes (restaurant_id, name, ingredients, image, price, description, category) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [restaurant_id, name, ingredients, image, price, description, category], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(201).json({ message: 'Dish added successfully' });
  });
};

// View Dishes
exports.getDishes = (req, res) => {
  const { restaurant_id } = req.params;
  const sql = 'SELECT * FROM dishes WHERE restaurant_id = ?';
  db.query(sql, [restaurant_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(result);
  });
};

// Update Dish
exports.updateDish = (req, res) => {
  const { dish_id } = req.params;
  const { name, ingredients, image, price, description, category } = req.body;
  if (!name && !ingredients && !image && !price && !description && !category) {
    return res.status(400).json({ error: 'At least one field is required' });
  }
  const sql = 'UPDATE dishes SET name = ?, ingredients = ?, image = ?, price = ?, description = ?, category = ? WHERE id = ?';
  db.query(sql, [name, ingredients, image, price, description, category, dish_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Dish not found' });
    res.json({ message: 'Dish updated successfully' });
  });
};

// Delete Dish
exports.deleteDish = (req, res) => {
  const { dish_id } = req.params;
  const sql = 'DELETE FROM dishes WHERE id = ?';
  db.query(sql, [dish_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Dish not found' });
    res.json({ message: 'Dish deleted successfully' });
  });
};

// View Orders (Fixed the query properly)
exports.getOrders = (req, res) => {
  const { restaurant_id } = req.params;
  const sql = `
    SELECT o.id AS order_id, o.customer_id, o.status, o.created_at,
           c.name AS customer_name,
           GROUP_CONCAT(d.name SEPARATOR ', ') AS dish_names,
           SUM(d.price * oi.quantity) AS total
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN dishes d ON oi.dish_id = d.id
    WHERE o.restaurant_id = ?
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;
  db.query(sql, [restaurant_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(result);
  });
};
