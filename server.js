// server.js
const dotenv = require('dotenv');
dotenv.config({ path: 'backend/config/config.env' });

const app = require('./backend/app');
const connectDatabase = require('./backend/config/database');

const PORT = process.env.PORT || 4000;

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down server due to Uncaught Exception');
  process.exit(1);
});

// Connect to database
connectDatabase();

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`);
  console.log('Shutting down server due to Unhandled Promise Rejection');
  
  server.close(() => {
    process.exit(1);
  });
});
