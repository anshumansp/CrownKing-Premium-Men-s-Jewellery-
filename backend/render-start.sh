#!/bin/bash

# Check if the environment is properly set up
if [ ! -f ".env" ]; then
  echo "No .env file found, using environment variables from Render"
fi

# Check if the dist directory exists
if [ ! -d "./dist" ]; then
  echo "Dist directory not found. Build may have failed."
  exit 1
fi

# Start the application
echo "Starting the backend application..."
node dist/server.js 