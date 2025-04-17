#!/bin/bash

# Deployment script for CrownKing backend
echo "Starting deployment process for CrownKing backend..."

# Ensure we're in the backend directory
if [ ! -f "./package.json" ]; then
  echo "Error: This script must be run from the backend directory!"
  exit 1
fi

# Install dependencies with forced type declarations
echo "Installing dependencies..."
npm install

# Install all required type declarations explicitly
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
  @types/sequelize

# Build the application with skipLibCheck to avoid type errors
echo "Building the application..."
npx tsc --skipLibCheck

# Verify build succeeded
if [ ! -d "./dist" ]; then
  echo "Error: Build failed - dist directory not created"
  exit 1
fi

echo "Backend deployment preparation completed successfully!"
echo "You can now start the server with: npm run start" 