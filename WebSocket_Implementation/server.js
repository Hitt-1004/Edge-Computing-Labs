const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Store connected users and chat rooms
const users = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data.type === 'join') {
      // Add user to the chat room
      users.set(ws, { username: data.username, room: data.room });
      
      // Broadcast a welcome message to the chat room
      broadcast({
        type: 'message',
        content: `${data.username} joined the chat`,
        room: data.room,
      });
      
      // Send the list of connected users to the newly joined user
      sendUserList(ws, data.room);
    } else if (data.type === 'message') {
      // Broadcast the message to the chat room
      broadcast({
        type: 'message',
        content: data.content,
        username: users.get(ws).username,
        room: users.get(ws).room,
      });
    }
  });

  ws.on('close', () => {
    // Remove user from the chat room
    const user = users.get(ws);
    if (user) {
      users.delete(ws);
      // Broadcast a goodbye message to the chat room
      broadcast({
        type: 'message',
        content: `${user.username} left the chat`,
        room: user.room,
      });
      // Send the updated list of connected users to the remaining users
      sendUserListToRoom(user.room);
    }
  });
});

// Broadcast a message to all connected clients
function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && users.get(client).room === message.room) {
      client.send(JSON.stringify(message));
    }
  });
}

// Send the list of connected users to a specific user
function sendUserList(ws, room) {
  const userList = Array.from(users.values())
    .filter((user) => user.room === room)
    .map((user) => user.username);

  ws.send(JSON.stringify({ type: 'userList', userList }));
}

// Send the updated list of connected users to all users in a specific chat room
function sendUserListToRoom(room) {
  const userList = Array.from(users.values())
    .filter((user) => user.room === room)
    .map((user) => user.username);

  const message = { type: 'userList', userList, room };

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && users.get(client).room === room) {
      client.send(JSON.stringify(message));
    }
  });
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
