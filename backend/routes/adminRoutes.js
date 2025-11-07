const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUserDetails,
  updateUserRole,
  deleteUser,
  getAdminStats,
  getProductsByCategory,
  getPendingVendorApplications,
  approveVendorApplication,
  rejectVendorApplication
} = require('../controllers/adminController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// All routes require admin role
router.use(isAuthenticatedUser, authorizeRoles('admin'));

// User management
router.get('/admin/users', getAllUsers);
router.get('/admin/user/:id', getUserDetails);
router.put('/admin/user/:id', updateUserRole);
router.delete('/admin/user/:id', deleteUser);

// Stats and analytics
router.get('/admin/stats', getAdminStats);
router.get('/admin/products/category', getProductsByCategory);

// Vendor application management
router.get('/admin/vendor-applications', getPendingVendorApplications);
router.put('/admin/vendor-applications/:id/approve', approveVendorApplication);
router.put('/admin/vendor-applications/:id/reject', rejectVendorApplication);

module.exports = router;
