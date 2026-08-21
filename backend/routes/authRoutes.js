// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  demoLogin,
} = require('../controllers/authController');

const { isAuthenticatedUser } = require('../middleware/auth');

// Public auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/demo-login', demoLogin);

// Protected auth route
router.get('/logout', isAuthenticatedUser, logoutUser);

module.exports = router;