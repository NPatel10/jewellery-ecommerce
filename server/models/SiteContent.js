const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['banner', 'collection', 'home_content', 'announcement'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  content: {
    type: String // HTML content for rich text
  },
  images: [{
    url: String,
    alt: String,
    caption: String
  }],
  links: [{
    text: String,
    url: String,
    isExternal: {
      type: Boolean,
      default: false
    }
  }],
  // For banners and collections
  category: {
    type: String,
    enum: ['rings', 'necklaces', 'earrings', 'bracelets', 'watches', 'festival', 'wedding', 'other']
  },
  // Display order and positioning
  displayOrder: {
    type: Number,
    default: 0
  },
  position: {
    type: String,
    enum: ['hero', 'featured', 'sidebar', 'footer', 'popup'],
    default: 'featured'
  },
  // Scheduling
  isActive: {
    type: Boolean,
    default: true
  },
  publishAt: {
    type: Date,
    default: Date.now
  },
  expireAt: {
    type: Date
  },
  // Targeting
  targetAudience: {
    type: String,
    enum: ['all', 'new_users', 'returning_users', 'premium_users'],
    default: 'all'
  },
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
siteContentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('SiteContent', siteContentSchema);