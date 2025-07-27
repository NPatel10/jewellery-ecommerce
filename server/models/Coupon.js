const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  maxDiscount: {
    type: Number,
    min: 0
  },
  usageLimit: {
    type: Number,
    min: 1
  },
  usedCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  applicableCategories: [{
    type: String,
    enum: ['rings', 'necklaces', 'earrings', 'bracelets', 'watches', 'other']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validate dates
couponSchema.pre('save', function(next) {
  if (this.validFrom >= this.validUntil) {
    next(new Error('Valid from date must be before valid until date'));
  }
  
  if (this.type === 'percentage' && this.value > 100) {
    next(new Error('Percentage discount cannot exceed 100%'));
  }
  
  next();
});

module.exports = mongoose.model('Coupon', couponSchema);