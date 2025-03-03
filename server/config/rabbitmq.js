const amqp = require('amqplib');
const logger = require('../utils/logger');

let channel;
let connection;

const setupRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    
    // Define queues
    await channel.assertQueue('orders', { durable: true });
    await channel.assertQueue('inventory', { durable: true });
    await channel.assertQueue('notifications', { durable: true });
    
    logger.info('RabbitMQ connected successfully');
    
    return { channel, connection };
  } catch (error) {
    logger.error(`Error connecting to RabbitMQ: ${error.message}`);
    process.exit(1);
  }
};

const getChannel = () => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
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
