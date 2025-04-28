const db = require('../config/db');

// Place Order
exports.placeOrder = (req, res) => {
  const { customer_id, restaurant_id, status, items } = req.body;

  if (!customer_id || !restaurant_id || !status || !items || items.length === 0) {
    return res.status(400).json({ error: 'Required fields are missing' });
  }

  db.beginTransaction(async (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    try {
      const [cartItems] = await db.promise().query(
        `SELECT c.quantity, d.price 
         FROM cart c
         JOIN dishes d ON c.dish_id = d.id
         WHERE c.customer_id = ?`,
        [customer_id]
      );

      const total = cartItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

      const orderSql = `
        INSERT INTO orders (customer_id, restaurant_id, status, total)
        VALUES (?, ?, ?, ?)
      `;
      const [orderResult] = await db.promise().query(orderSql, [customer_id, restaurant_id, status, total]);

      const orderItemsSql = `
        INSERT INTO order_items (order_id, dish_id, quantity)
        VALUES ?
      `;
      const orderItemsValues = items.map((item) => [orderResult.insertId, item.dish_id, item.quantity]);
      await db.promise().query(orderItemsSql, [orderItemsValues]);

      await db.promise().query(
        `DELETE FROM cart WHERE customer_id = ?`,
        [customer_id]
      );

      await db.promise().commit();

      res.status(201).json({
        message: 'Order placed successfully',
        orderId: orderResult.insertId,
        total: total.toFixed(2)
      });
    } catch (error) {
      await db.promise().rollback();
      res.status(500).json({ error: 'Database error' });
    }
  });
};

// Update Order Status
exports.updateOrderStatus = (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  db.query(sql, [status, order_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order status updated successfully' });
  });
};

// Update Order (Duplicate, same as updateOrderStatus but kept if needed)
exports.updateOrder = (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  db.query(sql, [status, order_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json({ message: 'Order status updated successfully' });
  });
};

// Get Order by ID
exports.getOrderById = (req, res) => {
  const { order_id } = req.params;

  const sql = 'SELECT * FROM orders WHERE id = ?';
  db.query(sql, [order_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result[0]);
  });
};

// View Customer Profile for an Order
exports.getCustomerForOrder = (req, res) => {
  const { order_id } = req.params;

  const sql = `
    SELECT c.*
    FROM customers c
    JOIN orders o ON c.id = o.customer_id
    WHERE o.id = ?
  `;
  db.query(sql, [order_id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'Customer not found for this order' });
    res.json(result[0]);
  });
};
