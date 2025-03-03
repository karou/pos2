const amqp = require('amqplib');
const logger = require('../utils/logger');

let channel;
let connection;

const setupRabbitMQ = async () => {
  try {
    // Use default credentials if not provided in env
    const rabbitUser = process.env.RABBITMQ_USER || 'guest';
    const rabbitPassword = process.env.RABBITMQ_PASSWORD || 'guest';
    const rabbitHost = process.env.RABBITMQ_HOST || 'localhost';
    const rabbitPort = process.env.RABBITMQ_PORT || 5672;
    const rabbitVHost = process.env.RABBITMQ_VHOST || '/';
    
    // Construct URL with credentials
    const rabbitUrl = `amqp://${rabbitUser}:${rabbitPassword}@${rabbitHost}:${rabbitPort}/${rabbitVHost}`;
    
    logger.info('Connecting to RabbitMQ...');
    connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    
    // Define queues
    await channel.assertQueue('orders', { durable: true });
    await channel.assertQueue('inventory', { durable: true });
    await channel.assertQueue('notifications', { durable: true });
    
    logger.info('RabbitMQ connected successfully');
    
    return { channel, connection };
  } catch (error) {
    logger.error(`Error connecting to RabbitMQ: ${error.message}`);
    // Don't exit process, just return null
    return null;
  }
};

const getChannel = () => {
  if (!channel) {
    logger.warn('RabbitMQ channel not initialized, attempting to reconnect');
    setupRabbitMQ().catch(err => {
      logger.error(`Failed to reconnect to RabbitMQ: ${err.message}`);
    });
    return null;
  }
  return channel;
};

const publishToQueue = async (queue, message) => {
  try {
    const ch = getChannel();
    return ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true
    });
  } catch (error) {
    logger.error(`Error publishing to queue ${queue}: ${error.message}`);
    throw error;
  }
};

const consumeFromQueue = async (queue, callback) => {
  try {
    const ch = getChannel();
    return ch.consume(queue, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        callback(content);
        ch.ack(msg);
      }
    });
  } catch (error) {
    logger.error(`Error consuming from queue ${queue}: ${error.message}`);
    throw error;
  }
};

module.exports = { 
  setupRabbitMQ, 
  getChannel, 
  publishToQueue, 
  consumeFromQueue 
};
