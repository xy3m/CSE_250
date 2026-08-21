// backend/config/database.js
const mongoose = require('mongoose');

let isConnected = false;

const connectDatabase = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.DB_URI || process.env.MONGODB_URI;
  if (!uri) {
    console.warn('⚠️ No DB_URI / MONGODB_URI found in environment variables');
    return;
  }

  mongoose.set('strictQuery', false);

  try {
    const data = await mongoose.connect(uri, {
      family: 4,
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB connected: ${data.connection.host}`);
    return data.connection;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
  }
};

module.exports = connectDatabase;

