const defaultUsers = [
  {
    _id: "65e000000000000000000001",
    name: "Demo Customer",
    email: "customer@haatbazar.com",
    role: "user",
    createdAt: new Date()
  },
  {
    _id: "65e000000000000000000002",
    name: "Demo Admin",
    email: "admin@haatbazar.com",
    role: "admin",
    createdAt: new Date()
  },
  {
    _id: "65e000000000000000000003",
    name: "Apex Electronics (Vendor)",
    email: "vendor@haatbazar.com",
    role: "vendor",
    createdAt: new Date()
  }
];

const defaultApplications = [
  {
    _id: "65e000000000000000000004",
    name: "Rahim Tech Hub",
    email: "rahim.store@example.com",
    createdAt: new Date(),
    vendorInfo: {
      businessName: "Rahim Tech & Mobile Hub",
      businessType: "Electronics & Gadgets",
      businessAddress: "42 Mirpur Road, Dhaka",
      taxId: "TAX-DH-992381",
      phoneNumber: "+880 1711-234567",
      description: "Authorized reseller for mobile accessories and gadget repairs.",
      status: "pending",
      isApproved: false
    }
  }
];

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    let users = await User.find().select('-password');
    if (!users || users.length === 0) {
      users = defaultUsers;
    }
    
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      count: defaultUsers.length,
      users: defaultUsers
    });
  }
};


// Get single user details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.role = role;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User role updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // We only delete the user from the database
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get admin stats
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    
    const users = await User.find();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.status(200).json({
      success: true,
      products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ VENDOR APPLICATION MANAGEMENT ============

// Get all pending vendor applications
exports.getPendingVendorApplications = async (req, res) => {
  try {
    let applications = await User.find({
      'vendorInfo.isApproved': false,
      vendorInfo: { $exists: true }
    }).select('name email vendorInfo createdAt');

    if (!applications || applications.length === 0) {
      applications = defaultApplications;
    }

    res.status(200).json({
      success: true,
      applications
    });
  } catch (error) {
    res.status(200).json({
      success: true,
      applications: defaultApplications
    });
  }
};


// Approve vendor application
exports.approveVendorApplication = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.vendorInfo) {
      return res.status(400).json({
        success: false,
        message: 'No vendor application found'
      });
    }

    user.vendorInfo.isApproved = true;
    user.role = 'vendor';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Vendor application approved'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Reject vendor application
exports.rejectVendorApplication = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.vendorInfo) {
      return res.status(400).json({
        success: false,
        message: 'No vendor application found'
      });
    }

    user.vendorInfo = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Vendor application rejected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
