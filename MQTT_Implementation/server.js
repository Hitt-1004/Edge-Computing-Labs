const mqtt = require('mqtt');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Connect to MQTT HQ public MQTT broker
const client = mqtt.connect('mqtt://public.mqtthq.com:1883');

// WebSocket connection for real-time updates to the dashboard
wss.on('connection', (ws) => {
  console.log('WebSocket connected');
});

// Subscribe to MQTT topic for vehicle location updates
client.on('connect', () => {
  console.log('Connecting to MQTT broker');
  client.subscribe('vehicle/location', (err) => {
    if (err) {
      console.error('MQTT subscription error:', err);
    } else {
      console.log('Subscribed to MQTT topic for vehicle locations');
    }
  });
});

// Handle incoming MQTT messages
client.on('message', (topic, message) => {
  // Parse MQTT message
  const data = JSON.parse(message.toString());
  console.log(data);

  // Broadcast data to connected WebSocket clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
});

// Serve static files for the web dashboard
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
