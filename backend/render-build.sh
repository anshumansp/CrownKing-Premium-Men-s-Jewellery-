#!/bin/bash

# Render.com build script for CrownKing backend
echo "Starting Render.com build process for CrownKing backend..."

# Make scripts executable just in case
chmod +x scripts/install-types.js

# Install dependencies 
echo "Installing dependencies..."
npm install

# Make sure types are installed explicitly - this is crucial for the build
echo "Installing TypeScript type declarations..."
npm install --save-dev \
  @types/express \
  @types/cors \
  @types/express-session \
  @types/passport \
  @types/passport-google-oauth20 \
  @types/jsonwebtoken \
  @types/morgan \
  @types/nodemailer \
  @types/sequelize \
  @types/bcryptjs \
  @types/helmet

# Verify types were installed
echo "Verifying type declarations..."
if [ ! -d "./node_modules/@types/express" ]; then
  echo "Error: @types/express not installed correctly. Installing manually..."
  npm install --save-dev @types/express
fi

# Build the TypeScript project with skipLibCheck
echo "Building the application..."
npx tsc --skipLibCheck

# Copy any additional assets if needed
echo "Copying static assets..."
if [ -d "./src/assets" ]; then
  cp -r ./src/assets ./dist/
fi

# Verify build succeeded
if [ ! -d "./dist" ]; then
  echo "Error: Build failed - dist directory not created"
  exit 1
fi

echo "Build completed successfully!" 