const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts
} = require('../controllers/productController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/products', getProducts);
router.get('/product/:id', getProductDetails);

// Vendor routes
router.post('/product/new', isAuthenticatedUser, authorizeRoles('vendor', 'admin'), createProduct);
router.put('/product/:id', isAuthenticatedUser, authorizeRoles('vendor', 'admin'), updateProduct);
router.delete('/product/:id', isAuthenticatedUser, authorizeRoles('vendor', 'admin'), deleteProduct);
router.get('/vendor/products', isAuthenticatedUser, authorizeRoles('vendor', 'admin'), getVendorProducts);

module.exports = router;
