const { createClient } = require('redis');
const logger = require('../utils/logger');

let redisClient;

const setupRedis = async () => {
  try {
    redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      password: process.env.REDIS_PASSWORD || undefined
    });

    redisClient.on('error', (err) => {
      logger.error(`Redis Error: ${err}`);
    });

    await redisClient.connect();
    logger.info('Redis connected successfully');
    
    return redisClient;
  } catch (error) {
    logger.error(`Error connecting to Redis: ${error.message}`);
    process.exit(1);
  }
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

module.exports = { setupRedis, getRedisClient };
