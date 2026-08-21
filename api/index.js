// api/index.js - Vercel Serverless Function Handler
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../backend/config/config.env') });
dotenv.config();

// Ensure critical defaults
process.env.JWT_SECRET = process.env.JWT_SECRET || 'haatbazar_super_secure_jwt_secret_key_2026';
process.env.JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
process.env.COOKIE_EXPIRE = process.env.COOKIE_EXPIRE || '7';

const app = require('../backend/app');

module.exports = app;

