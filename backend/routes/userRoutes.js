// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();

const {
  getUserProfile,
  updatePassword,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress
} = require('../controllers/userController');

const { isAuthenticatedUser } = require('../middleware/auth');

// All these routes are protected and require a user to be logged in

router.get('/me', isAuthenticatedUser, getUserProfile);
router.put('/password/update', isAuthenticatedUser, updatePassword);
router.put('/me/update', isAuthenticatedUser, updateProfile);

// Address management
router.post('/me/address', isAuthenticatedUser, addAddress);
router.put('/me/address/:addressId', isAuthenticatedUser, updateAddress);
router.delete('/me/address/:addressId', isAuthenticatedUser, deleteAddress);

module.exports = router;