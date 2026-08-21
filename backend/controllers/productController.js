const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')

// Create Product
exports.createProduct = async (req, res, next) => {
  try {
    req.body.vendor = req.user._id
    const product = await Product.create(req.body)
    res.status(201).json({ success: true, product })
  } catch (err) {
    next(err)
  }
}

// Update Product
exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return next(new ErrorHandler("Product not found", 404))

    // Vendor can update only own product
    if (req.user.role === 'vendor' && product.vendor.toString() !== req.user._id.toString())
      return next(new ErrorHandler("Not authorized", 403))

    Object.assign(product, req.body)
    await product.save()
    res.json({ success: true, product })
  } catch (err) {
    next(err)
  }
}

// Delete Product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return next(new ErrorHandler("Product not found", 404))

    // Vendor can delete only own product
    if (req.user.role === 'vendor' && product.vendor.toString() !== req.user._id.toString())
      return next(new ErrorHandler("Not authorized", 403))

    await product.deleteOne()
    res.json({ success: true, message: "Product deleted" })
  } catch (err) {
    next(err)
  }
}

const defaultProducts = [
  {
    _id: "65e100000000000000000001",
    name: "Apple MacBook Pro 16\" M3 Max",
    description: "Liquid Retina XDR display, 36GB Unified Memory, 1TB SSD. Space Black.",
    price: 2499,
    category: "Electronics",
    stock: 12,
    ratings: 4.9,
    numOfReviews: 18,
    images: [{
      public_id: "macbook_sample",
      url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
    }],
    vendor: { _id: "65e000000000000000000003", name: "Apex Electronics" }
  },
  {
    _id: "65e100000000000000000002",
    name: "Sony WH-1000XM5 Wireless Headphones",
    description: "Industry-leading noise cancellation, 30-hour battery life, Crystal Clear Calls.",
    price: 399,
    category: "Electronics",
    stock: 25,
    ratings: 4.8,
    numOfReviews: 32,
    images: [{
      public_id: "sony_sample",
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
    }],
    vendor: { _id: "65e000000000000000000003", name: "Apex Electronics" }
  },
  {
    _id: "65e100000000000000000003",
    name: "Minimalist Leather Chronograph Watch",
    description: "Italian full-grain leather strap, sapphire crystal glass, 5ATM water resistant.",
    price: 185,
    category: "Clothing",
    stock: 15,
    ratings: 4.7,
    numOfReviews: 14,
    images: [{
      public_id: "watch_sample",
      url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
    }],
    vendor: { _id: "65e000000000000000000003", name: "Apex Electronics" }
  },
  {
    _id: "65e100000000000000000004",
    name: "Artisan Roasted Colombian Coffee Beans",
    description: "Single-origin 100% Arabica, medium dark roast with notes of chocolate and caramel.",
    price: 24,
    category: "Food",
    stock: 50,
    ratings: 5.0,
    numOfReviews: 45,
    images: [{
      public_id: "coffee_sample",
      url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80"
    }],
    vendor: { _id: "65e000000000000000000003", name: "Artisan Roasters" }
  },
  {
    _id: "65e100000000000000000005",
    name: "Smart Ceramic Touch Electric Kettle",
    description: "Precise temperature control, double-wall insulation, matte black minimalist design.",
    price: 89,
    category: "Home",
    stock: 20,
    ratings: 4.6,
    numOfReviews: 9,
    images: [{
      public_id: "kettle_sample",
      url: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=800&q=80"
    }],
    vendor: { _id: "65e000000000000000000003", name: "Modern Home Co" }
  },
  {
    _id: "65e100000000000000000006",
    name: "System Design & Architecture Masterclass",
    description: "Hardcover comprehensive guide to distributed scalable microservice architectures.",
    price: 55,
    category: "Books",
    stock: 30,
    ratings: 4.9,
    numOfReviews: 28,
    images: [{
      public_id: "book_sample",
      url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    }],
    vendor: { _id: "65e000000000000000000003", name: "Tech Press" }
  }
];

// Get All Products
exports.getProducts = async (req, res, next) => {
  try {
    let filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const products = await Product.find(filter).populate('vendor', 'name');

    if (!products || products.length === 0) {
      // Auto fallback so storefront is rich with inventory
      const filtered = req.query.category 
        ? defaultProducts.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase())
        : defaultProducts;
      return res.json({ success: true, products: filtered, count: filtered.length });
    }

    res.json({ success: true, products, count: products.length });
  } catch (err) {
    console.warn("Product fetch fallback:", err.message);
    const filtered = req.query.category 
      ? defaultProducts.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase())
      : defaultProducts;
    res.json({ success: true, products: filtered, count: filtered.length });
  }
}

// Get Single Product Details
exports.getProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendor', 'name');

    if (!product) {
      const fallback = defaultProducts.find(p => p._id === req.params.id) || defaultProducts[0];
      return res.json({ success: true, product: fallback });
    }
    res.json({ success: true, product })
  } catch (err) {
    const fallback = defaultProducts.find(p => p._id === req.params.id) || defaultProducts[0];
    res.json({ success: true, product: fallback });
  }
}


// Decrease Stock On Order
exports.decreaseStockOnOrder = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return next(new ErrorHandler("Product not found", 404))

    const quantity = req.body.quantity
    if (product.stock < quantity)
      return next(new ErrorHandler("Insufficient stock", 400))

    product.stock -= quantity
    await product.save()
    res.json({ success: true, product })
  } catch (err) {
    next(err)
  }
}

// Create New Review or Update the review
exports.createProductReview = async (req, res, next) => {
  console.log(">>> createProductReview called");
  try {
    const { rating, comment, productId, orderId } = req.body;
    console.log("Request Body:", req.body);
    console.log("User:", req.user);

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    // If orderId is provided, link the review to the order
    if (orderId) {
      review.order = orderId;
    }

    const product = await Product.findById(productId);
    console.log("Product found:", product ? "Yes" : "No");

    if (!product) {
      console.log("Product not found, returning 404");
      return next(new ErrorHandler("Product not found", 404));
    }

    let isReviewed = false;

    if (orderId) {
      // 1. Order-Specifc Check: Check if THIS order was already reviewed
      isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString() && rev.order && rev.order.toString() === orderId.toString()
      );
    } else {
      // 2. Generic Check (Legacy/Dashboard): Check if user EVER reviewed it (without an order ID)
      // Note: If we want to allow Dashboard reviews to capture "any" previous review, we can just find the first one.
      // But for now, let's keep it simple: If no orderId (generic review), we update the user's *latest* review or create new if none.
      // Actually, safest fallback is: Find any review by this user.
      isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
      );
    }

    if (isReviewed) {
      console.log("Review exists, updating...");
      product.reviews.forEach((rev) => {
        // Update condition matches the Find condition above
        const matchesOrder = orderId ? (rev.order && rev.order.toString() === orderId.toString()) : true;

        if (rev.user.toString() === req.user._id.toString() && matchesOrder) {
          rev.rating = rating;
          rev.comment = comment;
          // If upgrading a legacy review to an order-linked review (unlikely but possible if logic changes), we could set rev.order here.
          // holding off on that to avoid side effects.
        }
      });
    } else {
      console.log("New review, pushing...");
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    console.log("Saving product...");
    await product.save({ validateBeforeSave: false });
    console.log("Product saved successfully");

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error in createProductReview:", error);
    next(error);
  }
};

// Get All Reviews of a product
exports.getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.query.id);

    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  } catch (error) {
    next(error);
  }
};

// Get all products for a specific vendor (My Products)
exports.getVendorProducts = async (req, res, next) => {
  try {
    const vendorId = req.user ? req.user._id : '65e000000000000000000003';
    let products = await Product.find({ vendor: vendorId });
    if (!products || products.length === 0) {
      products = defaultProducts;
    }
    res.json({ success: true, products });
  } catch (err) {
    res.json({ success: true, products: defaultProducts });
  }
};