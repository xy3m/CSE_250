const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TaxId = require('../models/taxIdModel');
const connectDatabase = require('../config/database');

// 1. Load Config
dotenv.config({ path: 'backend/config/config.env' });

// 2. Connect to Database
connectDatabase();

// 3. Generate Random 13-Digit Number
const generateRandomTaxId = () => {
  let result = '';
  const characters = '0123456789';
  for (let i = 0; i < 13; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// 4. Seed Function
const seedTaxIds = async () => {
  try {
    // Optional: Clear existing IDs first
    await TaxId.deleteMany(); 
    console.log('Old Tax IDs deleted');

    const taxIds = [];
    for (let i = 0; i < 50; i++) {
      taxIds.push({ number: generateRandomTaxId() });
    }

    await TaxId.insertMany(taxIds);
    console.log('✅ 50 New Tax IDs added successfully!');
    
    // Print a few for testing
    console.log('Sample Valid IDs:', taxIds.slice(0, 3).map(t => t.number));

    process.exit();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedTaxIds();