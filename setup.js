const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to execute shell commands
function executeCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    return output;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Function to check if a file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Function to create .env file if it doesn't exist
function createEnvFile() {
  const envPath = path.join(__dirname, '.env');
  const envExamplePath = path.join(__dirname, '.env.example');
  
  if (!fileExists(envPath) && fileExists(envExamplePath)) {
    console.log('Creating .env file from .env.example...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('.env file created successfully.');
  } else if (fileExists(envPath)) {
    console.log('.env file already exists.');
  } else {
    console.error('.env.example file not found. Please create a .env file manually.');
  }
}

// Main setup function
async function setup() {
  console.log('Starting setup process...');
  
  // Install server dependencies
  console.log('\n=== Installing server dependencies ===');
  executeCommand('npm install');
  
  // Install client dependencies
  console.log('\n=== Installing client dependencies ===');
  if (fs.existsSync(path.join(__dirname, 'client'))) {
    executeCommand('cd client && npm install');
  } else {
    console.log('Client directory not found. Skipping client dependencies.');
  }
  
  // Create .env file
  console.log('\n=== Setting up environment variables ===');
  createEnvFile();
  
  console.log('\n=== Setup completed successfully ===');
  console.log('\nNext steps:');
  console.log('1. Make sure Docker Desktop is running');
  console.log('2. Start the development containers: npm run docker:dev');
  console.log('3. Seed the database: npm run seed');
  console.log('4. Start the development server: npm run dev:all');
}

// Run setup
setup().catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
});
