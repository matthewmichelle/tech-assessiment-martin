/* eslint-disable @typescript-eslint/no-var-requires */
const express = require('express');
const amqp = require('amqplib/callback_api');

const app = express();
const port = 3000;

// Connection URL to RabbitMQ server
const amqpUrl = 'amqp://localhost'; // Use appropriate URL for your RabbitMQ server

// Queue name
const queue = 'job-q';

// Connect to RabbitMQ server
amqp.connect(amqpUrl, (err, connection) => {
  if (err) {
    throw err;
  }

  // Create a channel
  connection.createChannel((err, channel) => {
    if (err) {
      throw err;
    }

    // Assert a queue into existence
    channel.assertQueue(queue, {
      durable: true, // Queue will survive broker restart even if no consumers are connected
    });

    console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`);

    // Consume messages from the queue
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log(`Received: ${msg.content.toString()}`);
        channel.ack(msg); // Acknowledge the message
      }
    });
  });
});

// Define a simple route
app.get('/', (req, res) => {
  res.send('RabbitMQ Consumer is running!');
});

// Start the Express server
app.listen(port, () => {
  console.log(`Express server listening at http://localhost:${port}`);
});
