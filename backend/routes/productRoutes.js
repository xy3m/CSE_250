
const express = require('express')
const router = express.Router()
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  decreaseStockOnOrder,
  getVendorProducts, // <-- ADD THIS LINE
  getProductDetails, // <-- ADD THIS LINE
} = require('../controllers/productController')
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth')

router.route('/')
  .get(getProducts)
  .post(isAuthenticatedUser, authorizeRoles('vendor', 'admin'), createProduct)
router
  .route('/vendor')
  .get(isAuthenticatedUser, authorizeRoles('vendor', 'admin'), getVendorProducts)
router.route('/:id')
  .get(getProductDetails) // <-- ADD THIS LINE
  .put(isAuthenticatedUser, authorizeRoles('vendor', 'admin'), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles('vendor', 'admin'), deleteProduct)

router.route('/:id/decrease-stock')
  .patch(isAuthenticatedUser, decreaseStockOnOrder)

module.exports = router
