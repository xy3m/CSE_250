// backend/app.js - FINAL VERSION WITH CORS
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors'); // ADD THIS LINE

const app = express();

// Trust proxy for Render/Heroku/Vercel (Required for Secure cookies behind load balancer)
app.set('trust proxy', 1);

// CORS Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or server-to-server)
    if (!origin) return callback(null, true);

    const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
    const cleanOrigin = allowedOrigin.endsWith('/') ? allowedOrigin.slice(0, -1) : allowedOrigin;

    if (
      origin === cleanOrigin || 
      origin.includes('vercel.app') || 
      origin.includes('localhost') || 
      origin.includes('127.0.0.1')
    ) {
      return callback(null, true);
    }

    // Fallback allow for demo environments
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Other Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

// Auto-connect database on request (crucial for Serverless Vercel)
const connectDatabase = require('./config/database');
app.use(async (req, res, next) => {
  await connectDatabase();
  next();
});


// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoute');

const mongoose = require('mongoose');

// Use routes
// Health check route - Must be first to bypass auth middleware
app.get('/api/v1/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  const dbState = mongoose.connection.readyState; // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting

  res.status(200).json({
    success: true,
    message: 'HaatBazar API is running',
    dbStatus,
    dbState,
    timestamp: new Date().toISOString()
  });
});

app.use('/api/v1', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', vendorRoutes);
app.use('/api/v1', adminRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', paymentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to HaatBazar API',
    version: '1.0.0',
    documentation: 'Use Postman to test API endpoints',
    endpoints: {
      health: 'GET /api/v1/health',
      auth: 'POST /api/v1/register, /api/v1/login',
      products: 'GET /api/v1/products',
      orders: 'POST /api/v1/order/new',
      vendor: 'POST /api/v1/vendor/apply',
      admin: 'GET /api/v1/admin/stats'
    }
  });
});



// Error handling middleware (must be last)
const errorMiddleware = require('./middleware/error');
app.use(errorMiddleware);

module.exports = app;
