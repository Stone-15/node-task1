const express = require('express');
require('dotenv').config();

const app = express();
const NODE_ENV = process.env.NODE_ENV || 'development';

// Environment configuration with specific ports
const envConfig = {
  development: {
    message: 'Hi, I am DEV environment! 🚀',
    description: 'Hi from Aaron!!!',
    color: '#28a745',
    debug: true,
    defaultPort: 3001
  },
  qa: {
    message: 'Hi, I am QA environment! 🧪',
    description: 'Quality Assurance environment for testing',
    color: '#ffc107',
    debug: false,
    defaultPort: 3002
  },
  uat: {
    message: 'Hi, I am UAT environment! 📋',
    description: 'User Acceptance Testing environment',
    color: '#17a2b8',
    debug: false,
    defaultPort: 3003
  },
  production: {
    message: 'Hi, I am PRODUCTION environment! 🌟',
    description: 'Live production environment',
    color: '#dc3545',
    debug: false,
    defaultPort: 3000
  }
};

// Get current environment config
const currentEnv = envConfig[NODE_ENV] || envConfig.development;

// Set PORT based on environment or use environment variable override
const PORT = process.env.PORT || currentEnv.defaultPort;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    environment: NODE_ENV.toUpperCase(),
    message: currentEnv.message,
    description: currentEnv.description,
    timestamp: new Date().toISOString(),
    server: {
      port: PORT,
      uptime: process.uptime(),
      version: process.version
    },
    ports: {
      development: envConfig.development.defaultPort,
      qa: envConfig.qa.defaultPort,
      uat: envConfig.uat.defaultPort,
      production: envConfig.production.defaultPort
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/config', (req, res) => {
  if (currentEnv.debug) {
    res.json({
      environment: NODE_ENV,
      config: currentEnv,
      env_vars: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT
      },
      all_env_ports: {
        development: envConfig.development.defaultPort,
        qa: envConfig.qa.defaultPort,
        uat: envConfig.uat.defaultPort,
        production: envConfig.production.defaultPort
      }
    });
  } else {
    res.status(403).json({
      error: 'Configuration details not available in this environment'
    });
  }
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    environment: NODE_ENV,
    message: 'The requested endpoint does not exist'
  });
});

// Start server only when not in test mode
if (require.main === module) {
  const server = app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    🚀 SERVER STARTED 🚀                      ║
╠══════════════════════════════════════════════════════════════╣
║  Environment: ${NODE_ENV.toUpperCase().padEnd(47)} ║
║  Port:        ${PORT.toString().padEnd(47)} ║
║  Message:     ${currentEnv.message.padEnd(47)} ║
║  URL:         http://localhost:${PORT.toString().padEnd(39)} ║
╚══════════════════════════════════════════════════════════════╝
    `);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
      const alternatePort = PORT + 1;
      app.listen(alternatePort, () => {
        console.log(`Server started on alternate port ${alternatePort}`);
      });
    } else {
      console.error('Server error:', err);
    }
  });
}

module.exports = app;
