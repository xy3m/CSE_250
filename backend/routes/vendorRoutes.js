// backend/routes/vendorRoutes.js
const express = require('express');
const router = express.Router();

const {
  applyVendor,
  getVendorDashboard,
  getAllVendors,
  getPendingApplications,
  updateVendorStatus
} = require('../controllers/vendorController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// User routes
router.post('/vendor/apply', isAuthenticatedUser, applyVendor);

// Vendor routes
router.get('/vendor/dashboard', isAuthenticatedUser, authorizeRoles('vendor', 'admin'), getVendorDashboard);

// Admin routes
router.get('/admin/vendors', isAuthenticatedUser, authorizeRoles('admin'), getAllVendors);
router.get('/admin/vendor/applications', isAuthenticatedUser, authorizeRoles('admin'), getPendingApplications);
router.put('/admin/vendor/:id', isAuthenticatedUser, authorizeRoles('admin'), updateVendorStatus);

module.exports = router;
