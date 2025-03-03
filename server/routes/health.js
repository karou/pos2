const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { getRedisClient } = require('../config/redis');
const { getChannel } = require('../config/rabbitmq');

/**
 * @route   GET /api/health
 * @desc    Health check endpoint for all services
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Check Redis connection
    let redisStatus = 'disconnected';
    try {
      const redisClient = getRedisClient();
      if (redisClient) {
        await redisClient.ping();
        redisStatus = 'connected';
      }
    } catch (error) {
      redisStatus = 'disconnected';
    }
    
    // Check RabbitMQ connection
    let rabbitmqStatus = 'disconnected';
    try {
      const channel = getChannel();
      if (channel) {
        rabbitmqStatus = 'connected';
      }
    } catch (error) {
      rabbitmqStatus = 'disconnected';
    }
    
    // Overall status
    const isHealthy = mongoStatus === 'connected' && 
                      redisStatus === 'connected' && 
                      rabbitmqStatus === 'connected';
    
    return res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        mongodb: mongoStatus,
        redis: redisStatus,
        rabbitmq: rabbitmqStatus
      },
      uptime: process.uptime(),
      memory: process.memoryUsage()
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

module.exports = router;
