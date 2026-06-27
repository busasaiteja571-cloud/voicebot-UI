#!/usr/bin/env node

/**
 * set-env.js
 * 
 * Build-time environment configuration script for Angular + Vercel deployment
 * 
 * This script runs before the Angular build and writes Vercel environment variables
 * into the environment.prod.ts file as TypeScript constants.
 * 
 * Since Angular runs in the browser, we cannot use process.env at runtime.
 * Instead, we inject these values at build time into the TypeScript source.
 * 
 * Usage:
 *   node set-env.js production
 *   node set-env.js development
 */

const fs = require('fs');
const path = require('path');

// Get environment from command line argument or default to 'production'
const environment = process.argv[2] || 'production';

// Determine which environment file to update
const isProduction = environment === 'production';
const envFileName = isProduction ? 'environment.prod.ts' : 'environment.ts';
const envFilePath = path.join(__dirname, 'src', 'environments', envFileName);

// Read environment variables from process.env (available during build)
// Provide sensible defaults if not set
const apiBaseUrl = process.env.API_BASE_URL || (isProduction ? '/api' : 'http://localhost:8080/api');
const geminiApiKey = process.env.GEMINI_API_KEY || 'your-api-key-here';

// Create the environment file content
const environmentFileContent = `// This file was auto-generated during the build process on ${new Date().toISOString()}
// Environment variables are injected at build time, not runtime

export const environment = {
  production: ${isProduction},
  apiBaseUrl: '${sanitizeString(apiBaseUrl)}',
  geminiApiKey: '${sanitizeString(geminiApiKey)}'
};
`;

/**
 * Sanitize string to prevent injection attacks in generated code
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(str) {
  if (!str) return '';
  
  // Escape single quotes and backslashes
  return String(str)
    .replace(/\\/g, '\\\\')  // Backslashes first
    .replace(/'/g, "\\'");   // Then single quotes
}

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Directory path
 */
function ensureDirectoryExists(dirPath) {
  const directory = path.dirname(dirPath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

/**
 * Write environment configuration file
 */
function writeEnvironmentFile() {
  try {
    // Ensure the environments directory exists
    ensureDirectoryExists(envFilePath);

    // Write the environment file
    fs.writeFileSync(envFilePath, environmentFileContent, 'utf8');

    // Log success message with color
    const colorReset = '\x1b[0m';
    const colorGreen = '\x1b[32m';
    const colorCyan = '\x1b[36m';

    console.log(`${colorGreen}✓${colorReset} Environment file generated successfully`);
    console.log(`  ${colorCyan}File:${colorReset}        ${envFilePath}`);
    console.log(`  ${colorCyan}Environment:${colorReset} ${environment}`);
    console.log(`  ${colorCyan}API URL:${colorReset}     ${apiBaseUrl}`);
    console.log(`  ${colorCyan}Timestamp:${colorReset}  ${new Date().toISOString()}`);

  } catch (error) {
    const colorRed = '\x1b[31m';
    const colorReset = '\x1b[0m';
    
    console.error(`${colorRed}✗ Error writing environment file:${colorReset}`);
    console.error(`  ${error.message}`);
    process.exit(1);
  }
}

// Execute the function
if (require.main === module) {
  writeEnvironmentFile();
}

module.exports = { writeEnvironmentFile, sanitizeString, ensureDirectoryExists };
