const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 });

// Array to store connected clients
const clients = [];

// Handle new connections
wss.on('connection', function connection(ws) {
  console.log('A client connected');
  
  // Add new client to the clients array
  clients.push(ws);

  // Handle messages from clients
  ws.on('message', function incoming(message) {
    console.log('Received message:', message);

    // Broadcast the message to all connected clients
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // Handle client disconnection
  ws.on('close', function () {
    console.log('A client disconnected');
    // Remove disconnected client from the clients array
    clients.splice(clients.indexOf(ws), 1);
  });
});

console.log('WebSocket server is running on port 8080');
