// backend/controllers/authController.js
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');

// Register a user => /api/v1/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'sample_id', // We will fix this later
      url: 'sample_url'
    }
  });

  sendToken(user, 201, res);
});

// Login user => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password is provided
  if (!email || !password) {
    return next(new ErrorHandler('Please enter email and password', 400));
  }

  // Find user in database (include password field)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  sendToken(user, 200, res);
});

// Logout user => /api/v1/logout
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Quick 1-Click Demo Login for Portfolio Viewers / Fiverr Clients => /api/v1/demo-login
exports.demoLogin = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.body;
  const targetRole = (role || 'user').toLowerCase();

  let demoConfig = {
    email: 'customer@haatbazar.com',
    name: 'Demo Customer',
    role: 'user',
    password: 'password123'
  };

  if (targetRole === 'admin') {
    demoConfig = {
      email: 'admin@haatbazar.com',
      name: 'Demo Admin',
      role: 'admin',
      password: 'password123'
    };
  } else if (targetRole === 'vendor') {
    demoConfig = {
      email: 'vendor@haatbazar.com',
      name: 'Demo Vendor',
      role: 'vendor',
      password: 'password123'
    };
  }

  // Look for existing demo user by email or by role
  let user = await User.findOne({ email: demoConfig.email });
  if (!user) {
    user = await User.findOne({ role: demoConfig.role });
  }

  // If no user exists for this role, auto-create one with rich profile
  if (!user) {
    user = await User.create({
      name: demoConfig.name,
      email: demoConfig.email,
      password: demoConfig.password,
      role: demoConfig.role,
      avatar: {
        public_id: 'sample_id',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      },
      addresses: [{
        name: demoConfig.name,
        phone: '+1 555-0199',
        addressLine: '742 Evergreen Terrace',
        city: 'Metropolis',
        division: 'Dhaka',
        postalCode: '1205',
        isDefault: true
      }],
      vendorInfo: demoConfig.role === 'vendor' ? {
        businessName: 'Apex Electronics & Gear',
        businessType: 'Retail',
        businessAddress: '100 Innovation Way',
        taxId: 'TX-987654321',
        taxIdVerified: true,
        phoneNumber: '+1 555-0199',
        description: 'Premium electronics and everyday essentials vendor on HaatBazar.',
        status: 'approved',
        isApproved: true,
        applicationDate: new Date(),
        approvedDate: new Date()
      } : undefined
    });
  }

  sendToken(user, 200, res);
});