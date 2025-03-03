// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const { connectDB } = require('./config/db');
const { setupRedis } = require('./config/redis');
const { setupRabbitMQ } = require('./config/rabbitmq');
const logger = require('./utils/logger');
const headerSizeMiddleware = require('./middleware/headerSizeMiddleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const customerRoutes = require('./routes/customer.routes');
const healthRoutes = require('./routes/health');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Increase header size limits directly in Express
app.use((req, res, next) => {
  // Increase Express's internal header size limits
  req.connection.setMaxHeadersCount = 100; // Default is usually 50
  
  // For debugging - log headers for auth endpoints
  if (req.url.includes('/auth/')) {
    console.log('Auth request headers:', Object.keys(req.headers));
    console.log('Header size:', JSON.stringify(req.headers).length, 'bytes');
  }
  
  next();
});

// Configure CORS to be more permissive but secure
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL || 'http://localhost:3006' // Restrict in production
    : '*', // Allow all in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-auth-token'],
  credentials: false, // Don't allow cookies by default
  maxAge: 86400 // 24 hours
};

// Apply middleware
app.use(cors(corsOptions));
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? true : false,
}));

// Increase JSON payload limit to handle larger requests
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Apply header size middleware early to catch large headers
app.use(headerSizeMiddleware);

app.use(compression());
app.use(morgan('dev'));

// Health check endpoint
app.use('/api/health', healthRoutes);

// API Routes - Fixed the route handler formats
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/customers', customerRoutes);

// Simple health check for Docker
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// Import error handler
const errorHandler = require('./middleware/error');

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB with retry logic
    let retries = 5;
    while (retries) {
      try {
        await connectDB();
        break;
      } catch (err) {
        retries -= 1;
        logger.warn(`Failed to connect to MongoDB. Retries left: ${retries}`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      }
    }
    
    // Setup Redis with retry logic
    retries = 5;
    while (retries) {
      try {
        await setupRedis();
        break;
      } catch (err) {
        retries -= 1;
        logger.warn(`Failed to connect to Redis. Retries left: ${retries}`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      }
    }
    
    // Setup RabbitMQ with retry logic
    retries = 5;
    while (retries) {
      try {
        await setupRabbitMQ();
        break;
      } catch (err) {
        retries -= 1;
        logger.warn(`Failed to connect to RabbitMQ. Retries left: ${retries}`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      }
    }
    
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received. Shutting down gracefully');
  process.exit(0);
});