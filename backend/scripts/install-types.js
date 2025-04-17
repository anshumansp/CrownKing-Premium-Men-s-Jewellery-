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

// Function to check if package is installed
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

// Install missing type packages
const missingTypePackages = typePackages.filter(
  (pkg) => !isPackageInstalled(pkg)
);
if (missingTypePackages.length > 0) {
  console.log(
    `Installing missing type packages: ${missingTypePackages.join(', ')}`
  );
  try {
    execSync(`npm install --save-dev ${missingTypePackages.join(' ')}`, {
      stdio: 'inherit',
    });
  } catch (error) {
    console.error('Failed to install type packages:', error);
  }
}

// Install packages with their own types
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
