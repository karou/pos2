const { createClient } = require('redis');
const logger = require('../utils/logger');

let redisClient;

const setupRedis = async () => {
  try {
    // Use default password 'password' if not provided in env
    const redisPassword = process.env.REDIS_PASSWORD || 'password';
    
    redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
      password: redisPassword,
      socket: {
        reconnectStrategy: (retries) => {
          // Exponential backoff with max delay of 10 seconds
          const delay = Math.min(Math.pow(2, retries) * 100, 10000);
          logger.info(`Redis reconnecting in ${delay}ms...`);
          return delay;
        }
      }
    });

    redisClient.on('error', (err) => {
      logger.error(`Redis Error: ${err}`);
      // Don't exit process on connection error, just log it
    });

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('reconnecting', () => {
      logger.info('Redis client reconnecting');
    });

    await redisClient.connect();
    logger.info('Redis connected successfully');
    
    return redisClient;
  } catch (error) {
    logger.error(`Error connecting to Redis: ${error.message}`);
    // Don't exit process, return null instead
    return null;
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    logger.warn('Redis client not initialized, attempting to reconnect');
    setupRedis().catch(err => {
      logger.error(`Failed to reconnect to Redis: ${err.message}`);
    });
    return null;
  }
  return redisClient;
};

module.exports = { setupRedis, getRedisClient };
