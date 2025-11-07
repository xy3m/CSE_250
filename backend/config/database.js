// backend/config/database.js
const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose.set('strictQuery', false);
  
  mongoose.connect(process.env.MONGODB_URI, {
    // Remove deprecated options - only keep these:
    family: 4
  })
  .then((data) => {
    console.log(`✅ MongoDB connected: ${data.connection.host}`);
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
};

module.exports = connectDatabase;
