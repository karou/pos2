const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to execute shell commands
function executeCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    const output = execSync(command, { encoding: 'utf8' });
    console.log(output);
    return output;
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    return null;
  }
}

// Function to check if Docker is installed
function checkDocker() {
  try {
    executeCommand('docker --version');
    executeCommand('docker-compose --version');
    return true;
  } catch (error) {
    console.error('Docker or Docker Compose is not installed.');
    console.error('Please install Docker and Docker Compose before continuing.');
    return false;
  }
}

// Function to start Docker containers
function startContainers() {
  console.log('Starting Docker containers...');
  executeCommand('docker-compose up -d');
  console.log('Docker containers started successfully.');
}

// Function to stop Docker containers
function stopContainers() {
  console.log('Stopping Docker containers...');
  executeCommand('docker-compose down');
  console.log('Docker containers stopped successfully.');
}

// Function to restart Docker containers
function restartContainers() {
  console.log('Restarting Docker containers...');
  executeCommand('docker-compose restart');
  console.log('Docker containers restarted successfully.');
}

// Function to check container status
function checkStatus() {
  console.log('Checking container status...');
  executeCommand('docker-compose ps');
}

// Function to view container logs
function viewLogs(service) {
  if (service) {
    executeCommand(`docker-compose logs ${service}`);
  } else {
    executeCommand('docker-compose logs');
  }
}

// Function to initialize database with sample data
function initializeDatabase() {
  console.log('Initializing database with sample data...');
  executeCommand('node scripts/seed.js');
  console.log('Database initialized successfully.');
}

// Function to check MongoDB connection
function checkMongoDB() {
  console.log('Checking MongoDB connection...');
  executeCommand('docker exec mayurapos-mongodb mongosh --eval "db.adminCommand(\'ping\')" -u admin -p password --authenticationDatabase admin');
}

// Function to check Redis connection
function checkRedis() {
  console.log('Checking Redis connection...');
  executeCommand('docker exec mayurapos-redis redis-cli -a password ping');
}

// Function to check RabbitMQ connection
function checkRabbitMQ() {
  console.log('Checking RabbitMQ connection...');
  executeCommand('docker exec mayurapos-rabbitmq rabbitmqctl status');
}

// Function to prune unused Docker resources
function pruneResources() {
  console.log('Pruning unused Docker resources...');
  executeCommand('docker system prune -f');
  console.log('Docker resources pruned successfully.');
}

// Function to backup MongoDB data
function backupMongoDB() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.join(__dirname, '..', 'backups');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }
  
  const backupFile = path.join(backupDir, `mongodb-backup-${timestamp}.gz`);
  
  console.log(`Backing up MongoDB data to ${backupFile}...`);
  executeCommand(`docker exec mayurapos-mongodb mongodump --username admin --password password --authenticationDatabase admin --db mayurapos --archive --gzip > ${backupFile}`);
  console.log('MongoDB backup completed successfully.');
}

// Function to restore MongoDB data
function restoreMongoDB() {
  const backupDir = path.join(__dirname, '..', 'backups');
  
  if (!fs.existsSync(backupDir)) {
    console.error('No backups directory found.');
    return;
  }
  
  const backupFiles = fs.readdirSync(backupDir).filter(file => file.startsWith('mongodb-backup-'));
  
  if (backupFiles.length === 0) {
    console.error('No backup files found.');
    return;
  }
  
  console.log('Available backup files:');
  backupFiles.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
  });
  
  rl.question('Enter the number of the backup to restore: ', (choice) => {
    const index = parseInt(choice) - 1;
    
    if (isNaN(index) || index < 0 || index >= backupFiles.length) {
      console.error('Invalid choice.');
      return;
    }
    
    const backupFile = path.join(backupDir, backupFiles[index]);
    
    console.log(`Restoring MongoDB data from ${backupFile}...`);
    executeCommand(`docker exec -i mayurapos-mongodb mongorestore --username admin --password password --authenticationDatabase admin --gzip --archive < ${backupFile}`);
    console.log('MongoDB restore completed successfully.');
  });
}

// Function to start development containers only
function startDevContainers() {
  console.log('Starting development Docker containers...');
  executeCommand('docker-compose -f docker-compose.dev.yml up -d');
  console.log('Development Docker containers started successfully.');
}

// Function to stop development containers
function stopDevContainers() {
  console.log('Stopping development Docker containers...');
  executeCommand('docker-compose -f docker-compose.dev.yml down');
  console.log('Development Docker containers stopped successfully.');
}

// Main menu
function showMenu() {
  console.log('\n===== Docker Management Menu =====');
  console.log('1. Start all containers');
  console.log('2. Stop all containers');
  console.log('3. Restart all containers');
  console.log('4. Start development containers only');
  console.log('5. Stop development containers');
  console.log('6. Check container status');
  console.log('7. View logs');
  console.log('8. Initialize database with sample data');
  console.log('9. Check MongoDB connection');
  console.log('10. Check Redis connection');
  console.log('11. Check RabbitMQ connection');
  console.log('12. Prune unused Docker resources');
  console.log('13. Backup MongoDB data');
  console.log('14. Restore MongoDB data');
  console.log('0. Exit');
  
  rl.question('Enter your choice: ', (choice) => {
    switch (choice) {
      case '1':
        startContainers();
        showMenu();
        break;
      case '2':
        stopContainers();
        showMenu();
        break;
      case '3':
        restartContainers();
        showMenu();
        break;
      case '4':
        startDevContainers();
        showMenu();
        break;
      case '5':
        stopDevContainers();
        showMenu();
        break;
      case '6':
        checkStatus();
        showMenu();
        break;
      case '7':
        rl.question('Enter service name (leave empty for all): ', (service) => {
          viewLogs(service);
          showMenu();
        });
        break;
      case '8':
        initializeDatabase();
        showMenu();
        break;
      case '9':
        checkMongoDB();
        showMenu();
        break;
      case '10':
        checkRedis();
        showMenu();
        break;
      case '11':
        checkRabbitMQ();
        showMenu();
        break;
      case '12':
        pruneResources();
        showMenu();
        break;
      case '13':
        backupMongoDB();
        showMenu();
        break;
      case '14':
        restoreMongoDB();
        showMenu();
        break;
      case '0':
        console.log('Exiting...');
        rl.close();
        break;
      default:
        console.log('Invalid choice. Please try again.');
        showMenu();
        break;
    }
  });
}

// Check if Docker is installed before showing the menu
if (checkDocker()) {
  showMenu();
} else {
  rl.close();
}

module.exports = {
  startContainers,
  stopContainers,
  restartContainers,
  checkStatus,
  viewLogs,
  initializeDatabase,
  checkMongoDB,
  checkRedis,
  checkRabbitMQ,
  pruneResources,
  backupMongoDB,
  restoreMongoDB,
  startDevContainers,
  stopDevContainers
};
