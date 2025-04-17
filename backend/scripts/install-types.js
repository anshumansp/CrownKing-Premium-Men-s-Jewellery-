#!/usr/bin/env node

/**
 * This script installs TypeScript type declarations for dependencies
 * that might be missing during deployment.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// List of common type packages needed
const typePackages = [
  '@types/express',
  '@types/cors',
  '@types/express-session',
  '@types/passport',
  '@types/passport-google-oauth20',
  '@types/jsonwebtoken',
  '@types/morgan',
  '@types/nodemailer',
  '@types/sequelize',
];

// Additional packages that provide their own types
const packageWithOwnTypes = ['ioredis', 'stripe'];

console.log('Checking for missing type declarations...');

// Install all type packages regardless of check to ensure they're available during build
console.log(`Installing all necessary type packages: ${typePackages.join(', ')}`);
try {
  execSync(`npm install --save-dev ${typePackages.join(' ')}`, {
    stdio: 'inherit',
  });
  console.log('Type packages installed successfully');
} catch (error) {
  console.error('Failed to install type packages:', error);
  // Don't exit with error - let the build continue with what's available
}

// Install packages with their own types if not already in package.json
function isPackageInstalled(packageName) {
  try {
    const packageJsonPath = path.resolve(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    return (
      (packageJson.dependencies && packageJson.dependencies[packageName]) ||
      (packageJson.devDependencies && packageJson.devDependencies[packageName])
    );
  } catch (error) {
    console.error(`Error checking for package ${packageName}:`, error);
    return false;
  }
}

// Check and install missing packages with their own types
const missingPackages = packageWithOwnTypes.filter(
  (pkg) => !isPackageInstalled(pkg)
);
if (missingPackages.length > 0) {
  console.log(
    `Installing missing packages with their own types: ${missingPackages.join(', ')}`
  );
  try {
    execSync(`npm install ${missingPackages.join(' ')}`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to install packages:', error);
  }
}

console.log('Type declaration installation check complete!');
