const mqtt = require('mqtt');

// Connect to the HiveMQ MQTT broker
const client = mqtt.connect('mqtt://broker.hivemq.com');

// Topic to publish messages to
const topic = 'exampleTopic';

// Publish a message every second
setInterval(() => {
  const message = `Hello, message at ${new Date()}`;
  client.publish(topic, message);
  console.log(`Published: ${message}`);
}, 1000);
