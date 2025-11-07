const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  shippingInfo: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    division: {
      type: String,
      required: true
    },
    postalCode: {
      type: String,
      required: true
    }
  },

  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity cannot be less than 1']
      },
      image: {
        type: String,
        required: true
      },
      vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }
  ],

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  paymentInfo: {
    id: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'success', 'failed'],
      default: 'pending'
    },
    method: {
      type: String,
      required: true,
      enum: ['card', 'bkash', 'nagad', 'rocket', 'cod'],
      default: 'cod'
    }
  },

  paidAt: {
    type: Date
  },

  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },

  orderStatus: {
    type: String,
    required: true,
    enum: ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },

  statusTimeline: [
    {
      status: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      note: String
    }
  ],

  deliveredAt: Date,
  cancelledAt: Date,
  cancellationReason: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add initial status to timeline on creation
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    this.statusTimeline.push({
      status: 'Processing',
      timestamp: this.createdAt
    });
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ 'orderItems.vendor': 1 });
orderSchema.index({ orderStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);
