const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'INR']
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'cash_on_delivery'],
    required: true
  },
  paymentGateway: {
    type: String,
    enum: ['stripe', 'paypal', 'razorpay', 'mock'],
    default: 'mock'
  },
  transactionId: {
    type: String,
    trim: true
  },
  gatewayTransactionId: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  // Payment details
  cardLast4: String,
  cardBrand: String,
  // Amounts
  taxAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  shippingAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  // Refunds
  refundedAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  refunds: [{
    amount: Number,
    reason: String,
    refundedAt: {
      type: Date,
      default: Date.now
    },
    refundTransactionId: String
  }],
  // Timestamps
  paidAt: Date,
  failedAt: Date,
  cancelledAt: Date,
  // Gateway response
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  },
  failureReason: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt on save
paymentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Set timestamp based on status
  if (this.isModified('status')) {
    switch (this.status) {
      case 'completed':
        this.paidAt = new Date();
        break;
      case 'failed':
        this.failedAt = new Date();
        break;
      case 'cancelled':
        this.cancelledAt = new Date();
        break;
    }
  }
  
  next();
});

module.exports = mongoose.model('Payment', paymentSchema);