const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // React dev server
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Admin routes
app.use('/api/admin/customers', require('./routes/admin/customers'));
app.use('/api/admin/coupons', require('./routes/admin/coupons'));
app.use('/api/admin/site-content', require('./routes/admin/siteContent'));
app.use('/api/admin/payments', require('./routes/admin/payments'));
app.use('/api/admin/reports', require('./routes/admin/reports'));

// Public routes
app.use('/api/coupons', require('./routes/admin/coupons')); // For coupon validation
app.use('/api/site-content', require('./routes/admin/siteContent')); // For public content

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Jewellery E-commerce API Server' });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }
  
  // Mongoose duplicate key error
  if (error.code === 11000) {
    return res.status(400).json({
      message: 'Duplicate entry error',
      field: Object.keys(error.keyPattern)[0]
    });
  }
  
  // JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }
  
  // Default server error
  res.status(error.status || 500).json({
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jewellery_ecommerce')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});