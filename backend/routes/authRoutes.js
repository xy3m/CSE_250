// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
} = require('../controllers/authController');

const { isAuthenticatedUser } = require('../middleware/auth');

// Public auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected auth route
router.get('/logout', isAuthenticatedUser, logoutUser);

module.exports = router;