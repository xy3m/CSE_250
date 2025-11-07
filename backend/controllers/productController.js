// backend/controllers/productController.js
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const ApiFeatures = require('../utils/apiFeatures');

// Create new product => /api/v1/admin/product/new
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.vendor = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product
  });
});

// Get all products => /api/v1/products
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resultsPerPage = 12;
  const productsCount = await Product.countDocuments();

  const apiFeatures = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeatures.query;
  let filteredProductsCount = products.length;

  apiFeatures.pagination(resultsPerPage);
  products = await apiFeatures.query.clone();

  res.status(200).json({
    success: true,
    productsCount,
    resultsPerPage,
    filteredProductsCount,
    products
  });
});

// Get single product details => /api/v1/product/:id
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate('vendor', 'name email');

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  res.status(200).json({
    success: true,
    product
  });
});

// Update product => /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  // Check if user is the vendor of this product or admin
  if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorHandler('You are not authorized to update this product', 403));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    product
  });
});

// Delete product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }

  // Check if user is the vendor of this product or admin
  if (product.vendor.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorHandler('You are not authorized to delete this product', 403));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// Get all products by vendor => /api/v1/vendor/products
exports.getVendorProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find({ vendor: req.user.id });

  res.status(200).json({
    success: true,
    count: products.length,
    products
  });
});
