const express = require('express');

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define a route to handle webhook requests
app.post('/webhook', (req, res) => {
  // Extract data from the webhook request
  const { event, data } = req.body;

  // Process the webhook data
  console.log('Received webhook event:', event);
  console.log('Webhook data:', data);

  // Respond to the webhook request
  res.status(200).send('Webhook received successfully');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
