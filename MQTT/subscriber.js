const mqtt = require('mqtt');

// Connect to the HiveMQ MQTT broker
const client = mqtt.connect('mqtt://broker.hivemq.com');

// Topic to subscribe to
const topic = 'exampleTopic';

// Subscribe to the topic
client.subscribe(topic, (err) => {
  if (!err) {
    console.log(`Subscribed to topic: ${topic}`);
  }
});

// Handle incoming messages
client.on('message', (topic, message) => {
  console.log(`Received message on topic '${topic}': ${message.toString()}`);
});
