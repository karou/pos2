require('dotenv').config();
const express = require('express');
const { consumeFromQueue, publishToQueue, setupRabbitMQ } = require('../../config/rabbitmq');
const { connectDB } = require('../../config/db');
const logger = require('../../utils/logger');
const Order = require('../../models/Order');
const Product = require('../../models/Product');

const app = express();
const PORT = process.env.ORDER_SERVICE_PORT || 3001;

app.use(express.json());

// Process orders from queue
const processOrderQueue = async () => {
  await consumeFromQueue('orders', async (orderData) => {
    try {
      logger.info(`Processing order: ${orderData._id}`);
      
      // Update inventory
      await publishToQueue('inventory', {
        action: 'update',
        items: orderData.items
      });
      
      // Send notification
      await publishToQueue('notifications', {
        type: 'order_created',
        orderId: orderData._id,
        orderNumber: orderData.orderNumber,
        customerEmail: orderData.customer?.email,
        total: orderData.total
      });
      
      logger.info(`Order processed successfully: ${orderData._id}`);
    } catch (error) {
      logger.error(`Error processing order: ${error.message}`);
    }
  });
};

// Start the service
const startService = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Setup RabbitMQ
    await setupRabbitMQ();
    
    // Start processing orders
    await processOrderQueue();
    
    app.listen(PORT, () => {
      logger.info(`Order service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start order service: ${error.message}`);
    process.exit(1);
  }
};

startService();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection in Order Service: ${err.message}`);
  process.exit(1);
});
