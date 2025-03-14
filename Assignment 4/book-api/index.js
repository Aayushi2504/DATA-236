const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/book.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from your React app
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
}));
app.use(express.json()); // Parse JSON request bodies

// Routes
app.use('/api', userRoutes);

// Root route (optional)
app.get('/', (req, res) => {
    res.send('Welcome to the Book Management API!');
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});