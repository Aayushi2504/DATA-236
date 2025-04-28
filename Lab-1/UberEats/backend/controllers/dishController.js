// Get all restaurants
exports.getAllRestaurants = (req, res) => {
  const sql = 'SELECT * FROM restaurants';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(result);
  });
};

// Get all dishes
exports.getAllDishes = (req, res) => {
  const sql = 'SELECT * FROM dishes';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(result);
  });
};

// Get single dish by ID
exports.getDishById = (req, res) => {
  const { dish_id } = req.params;
  const sql = 'SELECT * FROM dishes WHERE id = ?';
  db.query(sql, [dish_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'Dish not found' });
    res.json(result[0]);
  });
};

// Search dishes by name
exports.searchDishes = (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  const sql = 'SELECT * FROM dishes WHERE name LIKE ?';
  db.query(sql, [`%${query}%`], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(result);
  });
};

// Search dishes by category
exports.searchDishesByCategory = (req, res) => {
  const { category } = req.query;
  if (!category) {
    return res.status(400).json({ error: 'Category is required' });
  }
  const sql = 'SELECT * FROM dishes WHERE category = ?';
  db.query(sql, [category], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(result);
  });
};

// Search restaurants by name
exports.searchRestaurantsByName = (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  const sql = 'SELECT * FROM restaurants WHERE name LIKE ?';
  db.query(sql, [`%${query}%`], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(result);
  });
};

// Search restaurants by location
exports.searchRestaurantsByLocation = (req, res) => {
  const { location } = req.query;
  if (!location) {
    return res.status(400).json({ error: 'Location is required' });
  }
  const sql = 'SELECT * FROM restaurants WHERE location LIKE ?';
  db.query(sql, [`%${location}%`], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(result);
  });
};
