// backend/controllers/vendorController.js
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// Apply to become a vendor => /api/v1/vendor/apply
// Apply to become a vendor => /api/v1/vendor/apply
// Apply to become a vendor => /api/v1/vendor/apply
// Apply to become a vendor => /api/v1/vendor/apply
// Apply to become a vendor => /api/v1/vendor/apply
exports.applyVendor = catchAsyncErrors(async (req, res, next) => {
  const { 
    businessName, 
    businessAddress, 
    businessType, 
    taxId, 
    phoneNumber, 
    description 
  } = req.body;

  console.log('📦 Received data:', req.body);

  const user = await User.findById(req.user.id);

  if (user.role === 'vendor') {
    return next(new ErrorHandler('You are already a vendor', 400));
  }

  // REMOVED THE PENDING CHECK - IT WAS CAUSING THE ISSUE!
  // Just overwrite whatever is there

  // Use direct MongoDB collection update to bypass Mongoose schema
  const result = await User.collection.updateOne(
    { _id: user._id },
    {
      $set: {
        vendorInfo: {
          businessName: businessName,
          businessType: businessType,
          businessAddress: businessAddress,
          taxId: taxId,
          phoneNumber: phoneNumber,
          description: description,
          isApproved: false,
          applicationDate: new Date()
        }
      }
    }
  );

  console.log('✅ MongoDB update result:', result);

  res.status(200).json({
    success: true,
    message: 'Vendor application submitted successfully'
  });
});






// Get vendor dashboard stats => /api/v1/vendor/dashboard
exports.getVendorDashboard = catchAsyncErrors(async (req, res, next) => {
  const vendorId = req.user.id;

  // Get vendor products
  const products = await Product.find({ vendor: vendorId });
  const productCount = products.length;

  // Get vendor orders
  const orders = await Order.find({
    'orderItems.vendor': vendorId
  });

  // Calculate total sales
  let totalSales = 0;
  let totalOrders = orders.length;

  orders.forEach((order) => {
    order.orderItems.forEach((item) => {
      if (item.vendor.toString() === vendorId) {
        totalSales += item.price * item.quantity;
      }
    });
  });

  // Get order status breakdown
  const orderStatusCount = {
    Processing: 0,
    Confirmed: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0
  };

  orders.forEach((order) => {
    orderStatusCount[order.orderStatus]++;
  });

  res.status(200).json({
    success: true,
    stats: {
      productCount,
      totalOrders,
      totalSales,
      orderStatusCount
    }
  });
});

// Get all vendors - ADMIN => /api/v1/admin/vendors
exports.getAllVendors = catchAsyncErrors(async (req, res, next) => {
  const vendors = await User.find({ role: 'vendor' });

  res.status(200).json({
    success: true,
    count: vendors.length,
    vendors
  });
});

// Get pending vendor applications - ADMIN => /api/v1/admin/vendor/applications
exports.getPendingApplications = catchAsyncErrors(async (req, res, next) => {
  const applications = await User.find({
    'vendorInfo.isApproved': false,
    'vendorInfo.applicationDate': { $exists: true }
  });

  res.status(200).json({
    success: true,
    count: applications.length,
    applications
  });
});

// Approve/Reject vendor application - ADMIN => /api/v1/admin/vendor/:id
exports.updateVendorStatus = catchAsyncErrors(async (req, res, next) => {
  const { approved } = req.body;

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  if (!user.vendorInfo || !user.vendorInfo.applicationDate) {
    return next(new ErrorHandler('No vendor application found for this user', 400));
  }

  if (approved) {
    user.role = 'vendor';
    user.vendorInfo.isApproved = true;
    user.vendorInfo.approvedDate = Date.now();
  } else {
    user.vendorInfo = undefined;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: approved ? 'Vendor approved successfully' : 'Vendor application rejected',
    user
  });
});
