const mongoose = require('mongoose');
const app = require('./app');
const port = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://mongodb:27017/uber_eats', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});