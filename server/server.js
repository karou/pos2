const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const { setupRedis } = require('./config/redis');
const { setupRabbitMQ } = require('./config/rabbitmq');
const logger = require('./utils/logger');
const headerSizeMiddleware = require('./middleware/headerSizeMiddleware');

// Load environment variables
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(helmet()); // Set security headers
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(headerSizeMiddleware);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: process.env.MONGO_USER || 'admin',
  pass: process.env.MONGO_PASSWORD || 'password',
  authSource: process.env.MONGO_AUTH_SOURCE || 'admin'
})
.then(() => logger.info('MongoDB connected'))
.catch(err => logger.error(`MongoDB connection error: ${err.message}`));

// Setup Redis
setupRedis().catch(err => {
  logger.error(`Redis setup error: ${err.message}`);
});

// Setup RabbitMQ
setupRabbitMQ().catch(err => {
  logger.error(`RabbitMQ setup error: ${err.message}`);
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reports', require('./routes/reports'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Server error: ${err.message}`);
  res.status(500).json({ error: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
