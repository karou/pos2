require('dotenv').config();
const express = require('express');
const { consumeFromQueue, publishToQueue, setupRabbitMQ } = require('../../config/rabbitmq');
const { connectDB } = require('../../config/db');
const logger = require('../../utils/logger');
const Product = require('../../models/Product');

const app = express();
const PORT = process.env.INVENTORY_SERVICE_PORT || 3002;

app.use(express.json());

// Process inventory updates from queue
const processInventoryQueue = async () => {
  await consumeFromQueue('inventory', async (data) => {
    try {
      logger.info(`Processing inventory action: ${data.action}`);
      
      if (data.action === 'update') {
        logger.info(`Updating inventory for ${data.items.length} items`);
        
        // Update inventory for each item
        for (const item of data.items) {
          const product = await Product.findById(item.product);
          
          if (product) {
            // Decrease stock
            product.stock -= item.quantity;
            
            // Ensure stock doesn't go below 0
            if (product.stock < 0) {
              product.stock = 0;
              logger.warn(`Stock for product ${product.name} went below 0`);
            }
            
            await product.save();
            logger.info(`Updated stock for ${product.name} to ${product.stock}`);
          }
        }
        
        // Check for low stock products
        const lowStockProducts = await Product.find({ stock: { $lt: 10 } });
        
        if (lowStockProducts.length > 0) {
          logger.info(`Found ${lowStockProducts.length} products with low stock`);
          
          await publishToQueue('notifications', {
            type: 'low_stock',
            products: lowStockProducts.map(p => ({
              id: p._id,
              name: p.name,
              stock: p.stock,
              sku: p.sku
            }))
          });
        }
      } else if (data.action === 'product_created') {
        logger.info(`New product created: ${data.product.name}`);
      } else if (data.action === 'product_updated') {
        logger.info(`Product updated: ${data.product.name}`);
      } else if (data.action === 'product_deleted') {
        logger.info(`Product deleted: ${data.productId}`);
      }
      
      logger.info('Inventory action processed successfully');
    } catch (error) {
      logger.error(`Error processing inventory action: ${error.message}`);
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
    
    // Start processing inventory updates
    await processInventoryQueue();
    
    app.listen(PORT, () => {
      logger.info(`Inventory service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start inventory service: ${error.message}`);
    process.exit(1);
  }
};

startService();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection in Inventory Service: ${err.message}`);
  process.exit(1);
});
