const mqtt = require('mqtt');

// Connect to the MQTT HQ broker
const client = mqtt.connect('mqtt://public.mqtthq.com:1883');

// Simulate sending vehicle location data every few seconds
setInterval(() => {
    const vehicleId = 'ABC123';
    const latitude = Math.random() * 90; // Random latitude between -90 and 90
    const longitude = Math.random() * 180; // Random longitude between -180 and 180

    // Publish the vehicle location data to the MQTT topic
    client.publish('vehicle/location', JSON.stringify({ vehicleId, latitude, longitude }));
    console.log('Published vehicle location:', { vehicleId, latitude, longitude });
}, 5000); // Send data every 5 seconds
