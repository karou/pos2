require('dotenv').config();
const express = require('express');
const { consumeFromQueue, setupRabbitMQ } = require('../../config/rabbitmq');
const { connectDB } = require('../../config/db');
const logger = require('../../utils/logger');

const app = express();
const PORT = process.env.NOTIFICATION_SERVICE_PORT || 3003;

app.use(express.json());

// Process notifications from queue
const processNotificationQueue = async () => {
  await consumeFromQueue('notifications', async (notification) => {
    try {
      logger.info(`Processing notification: ${notification.type}`);
      
      // Here you would integrate with email service, SMS service, etc.
      switch (notification.type) {
        case 'order_created':
          logger.info(`New order created: ${notification.orderNumber}`);
          if (notification.customerEmail) {
            // Send email confirmation to customer
            logger.info(`Sending order confirmation to ${notification.customerEmail}`);
            // Implement email sending logic here
          }
          break;
          
        case 'order_status_changed':
          logger.info(`Order status changed: ${notification.orderNumber} - Status: ${notification.orderStatus}`);
          // Notify relevant parties about order status change
          break;
          
        case 'low_stock':
          logger.info(`Low stock alert for ${notification.products.length} products`);
          // Send alert to admin/manager
          const productList = notification.products.map(p => 
            `${p.name} (SKU: ${p.sku}) - Current stock: ${p.stock}`
          ).join('\n');
          
          logger.info(`Low stock products:\n${productList}`);
          break;
          
        default:
          logger.info(`Unknown notification type: ${notification.type}`);
      }
      
      logger.info('Notification processed successfully');
    } catch (error) {
      logger.error(`Error processing notification: ${error.message}`);
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
    
    // Start processing notifications
    await processNotificationQueue();
    
    app.listen(PORT, () => {
      logger.info(`Notification service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start notification service: ${error.message}`);
    process.exit(1);
  }
};

startService();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection in Notification Service: ${err.message}`);
  process.exit(1);
});
