// app.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files
app.use(express.static('public'));

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Store code content for each room
const codeContent = {};

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for room joining
  socket.on('join', (room) => {
    // Join the specified room
    socket.join(room);

    // Send existing code content to the new user
    if (codeContent[room]) {
      socket.emit('code', codeContent[room]);
    }
  });

  // Listen for code changes
  socket.on('code', (code) => {
    const room = Array.from(socket.rooms)[1]; // Get the room ID

    // Store the code content
    codeContent[room] = code;

    // Broadcast the code content to all connected clients in the room
    io.to(room).emit('code', code);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
