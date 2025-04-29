const express = require('express');
const cors = require('cors');
const sessionMiddleware = require('./config/session');
const customerRoutes = require('./routes/customerRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');
const dishRoutes = require('./routes/dishRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(sessionMiddleware);

// Routes
app.use('/api/customer', customerRoutes);
app.use('/api/restaurant', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dishes', dishRoutes);

module.exports = app;
