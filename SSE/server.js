const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);

// Array to store tasks
let tasks = [];

// SSE endpoint
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  // Send initial task list on connection
  res.write(`data: ${JSON.stringify(tasks)}\n\n`);

  // Keep the connection open
  setInterval(() => {
    res.write(`data: ${JSON.stringify(tasks)}\n\n`);
  }, 1000);
});

// Express middleware for serving static files
app.use(express.static('public'));

// Express middleware for parsing JSON in POST requests
app.use(express.json());

// Endpoint for adding tasks
app.post('/add-task', (req, res) => {
  const { title } = req.body;
  const newTask = { id: uuidv4(), title, completed: false };
  tasks.push(newTask);

  // Send SSE update to all connected clients
  server.emit('updateTasks', tasks);

  res.json({ success: true, task: newTask });
});

// Endpoint for updating tasks
app.post('/update-task/:taskId', (req, res) => {
  const { taskId } = req.params;
  const { title, completed } = req.body;

  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], title, completed };

    // Send SSE update to all connected clients
    server.emit('updateTasks', tasks);

    res.json({ success: true, task: tasks[taskIndex] });
  } else {
    res.status(404).json({ success: false, message: 'Task not found' });
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
