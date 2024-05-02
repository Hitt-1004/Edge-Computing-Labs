import zenoh
import time
import random

def data_handler(data):
    print("Data Received:", data.payload.decode())
    temp = data.payload.decode().split(" ")[1]
    temp = float(temp[:-2])
    if temp >= 73:
        print("ALERT: Temperature exceeds threshold! Sending alert...")

def subscribe(session):
# Create a Zenoh subscriber with the data handler
    subscriber = session.declare_subscriber("server/temperature", data_handler)

def publish(session):
    # Create a Zenoh publisher
    publisher = session.declare_publisher("server/temperature")
    # Publishing loop
    count = 1
    while True:
        # Generate random temperature data
        temperature = random.uniform(35.0, 55.0)
        message = f"Current Temperature: {temperature:.2f} °C"

        # Publish the temperature data
        publisher.put(message.encode())
        print(f"Data Published: {message}")

        # Wait for a short interval
        time.sleep(2)
        count += 1

def main():
  # Create a Zenoh session
    session = zenoh.open()
    try:
        subscribe(session)
        publish(session)
    finally:
    # Close the Zenoh session
        session.close()
        
# Run the main function
main()