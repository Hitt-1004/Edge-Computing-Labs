const http = require('http');
const axios = require('axios'); // Replace 'node-fetch' with 'axios'
const nodemailer = require('nodemailer');

const API_KEY = 'c9dd8cc3501168180a6191c7a4fa8a9b'; // Replace with your OpenWeatherMap API key
const CITY = 'Gandhinagar'; // The city for which you want to receive weather updates
const THRESHOLD_TEMPERATURE = 28; // Temperature threshold in Celsius for triggering alerts
const PORT = 3000; // Port to listen for incoming webhook requests

// Email configuration
const EMAIL_SERVICE = 'gmail'; // E.g., 'Gmail'
const EMAIL_USER = 'hitt1003@gmail.com';
const EMAIL_PASS = 'mpnbs590A@';
const ALERT_EMAIL = 'hittbahal2003@gmail.com';

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/webhook') {
    try {
      const weatherData = await fetchWeatherData();
      const temperature = weatherData.main.temp;

      if (temperature > THRESHOLD_TEMPERATURE) {
        console.log(`High temperature alert: ${temperature}°C`);
        sendEmailAlert(temperature);
      } else {
        console.log(`Temperature is normal: ${temperature}°C`);
      }

      res.writeHead(200);
      res.end('Weather webhook received successfully');
    } catch (error) {
      console.error('Error fetching weather data:', error.message);
      res.writeHead(500);
      res.end('Internal server error');
    }
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

async function fetchWeatherData() {
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;
  const response = await axios.get(url); // Use axios for making HTTP GET requests
  return response.data;
}

function sendEmailAlert(temperature) {
  const mailOptions = {
    from: EMAIL_USER,
    to: ALERT_EMAIL,
    subject: 'High Temperature Alert',
    text: `High temperature alert: ${temperature}°C in ${CITY}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
