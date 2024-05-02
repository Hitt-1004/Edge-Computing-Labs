const WebSocket = require('ws');

// Connect to the WebSocket server
const ws = new WebSocket('ws://localhost:8080');

// Handle connection open event
ws.on('open', function open() {
  console.log('Connected to server');

  // Send a message to the server
  ws.send('Hello, server!');
});

// Handle messages from the server
ws.on('message', function incoming(message) {
  console.log('Received message from server:', message);
});

// Handle connection close event
ws.on('close', function close() {
  console.log('Disconnected from server');
});
