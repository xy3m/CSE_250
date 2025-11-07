// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updatePassword,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/authController');

const { isAuthenticatedUser } = require('../middleware/auth');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/logout', isAuthenticatedUser, logoutUser);
router.get('/me', isAuthenticatedUser, getUserProfile);
router.put('/password/update', isAuthenticatedUser, updatePassword);
router.put('/me/update', isAuthenticatedUser, updateProfile);

// Address management
router.post('/me/address', isAuthenticatedUser, addAddress);
router.put('/me/address/:addressId', isAuthenticatedUser, updateAddress);
router.delete('/me/address/:addressId', isAuthenticatedUser, deleteAddress);

module.exports = router;
