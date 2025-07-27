const express = require('express');
const Order = require('../../models/Order');
const User = require('../../models/User');
const Product = require('../../models/Product');
const Payment = require('../../models/Payment');
const { adminAuth } = require('../../middleware/auth');

const router = express.Router();

// Get dashboard overview stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const yesterday = new Date(now.setDate(now.getDate() - 1));

    const stats = await Promise.all([
      // Total counts
      Order.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Product.countDocuments({ isActive: true }),
      
      // This month stats
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      User.countDocuments({ role: 'user', createdAt: { $gte: startOfMonth } }),
      Product.countDocuments({ isActive: true, createdAt: { $gte: startOfMonth } }),
      
      // Revenue calculations
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Payment.aggregate([
        { $match: { status: 'completed', createdAt: { $gte: startOfMonth } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      
      // Recent orders
      Order.find().sort({ createdAt: -1 }).limit(5)
        .populate('user', 'name email')
        .populate('items.product', 'name')
    ]);

    res.json({
      overview: {
        totalOrders: stats[0],
        totalCustomers: stats[1],
        totalProducts: stats[2],
        totalRevenue: stats[6][0]?.total || 0
      },
      thisMonth: {
        orders: stats[3],
        customers: stats[4],
        products: stats[5],
        revenue: stats[7][0]?.total || 0
      },
      recentOrders: stats[8]
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get sales reports
router.get('/sales', adminAuth, async (req, res) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;
    
    let dateFilter = {};
    let groupBy = {};
    
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      const now = new Date();
      if (period === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { $gte: weekAgo } };
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
      } else if (period === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { $gte: monthAgo } };
        groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
      } else if (period === 'year') {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        dateFilter = { createdAt: { $gte: yearAgo } };
        groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
      }
    }

    const salesData = await Payment.aggregate([
      { 
        $match: { 
          status: 'completed',
          ...dateFilter
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$amount' },
          orders: { $sum: 1 },
          avgOrderValue: { $avg: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Category-wise sales
    const categorySales = await Order.aggregate([
      { 
        $match: {
          paymentStatus: 'completed',
          ...dateFilter
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          quantity: { $sum: '$items.quantity' }
        }
      }
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { 
        $match: {
          paymentStatus: 'completed',
          ...dateFilter
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          quantity: { $sum: '$items.quantity' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          revenue: 1,
          quantity: 1
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      period,
      salesData: salesData.map(item => ({ label: item._id, value: item.revenue })),
      salesDataDetailed: salesData, // Keep detailed data for internal use
      categorySales: categorySales.map(item => ({ label: item._id, value: item.revenue })),
      categorySalesDetailed: categorySales, // Keep detailed data for internal use
      topProducts: topProducts.map(item => ({ label: item.name, value: item.revenue, quantity: item.quantity })),
      topProductsDetailed: topProducts, // Keep detailed data for internal use
      summary: {
        totalRevenue: salesData.reduce((sum, item) => sum + item.revenue, 0),
        totalOrders: salesData.reduce((sum, item) => sum + item.orders, 0),
        avgOrderValue: salesData.length > 0 
          ? salesData.reduce((sum, item) => sum + item.avgOrderValue, 0) / salesData.length 
          : 0
      }
    });
  } catch (error) {
    console.error('Get sales reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get customer reports
router.get('/customers', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: monthAgo } };
    } else if (period === 'year') {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: yearAgo } };
    }

    const customerStats = await Promise.all([
      // New customers over time
      User.aggregate([
        { 
          $match: { 
            role: 'user',
            ...dateFilter
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            newCustomers: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      
      // Customer lifetime value
      Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        {
          $group: {
            _id: '$user',
            totalSpent: { $sum: '$totalAmount' },
            orderCount: { $sum: 1 },
            firstOrder: { $min: '$createdAt' },
            lastOrder: { $max: '$createdAt' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            name: '$user.name',
            email: '$user.email',
            totalSpent: 1,
            orderCount: 1,
            avgOrderValue: { $divide: ['$totalSpent', '$orderCount'] },
            firstOrder: 1,
            lastOrder: 1
          }
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 50 }
      ]),
      
      // Customer status distribution
      User.aggregate([
        { $match: { role: 'user' } },
        {
          $group: {
            _id: {
              isActive: '$isActive',
              isBlocked: '$isBlocked'
            },
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json({
      period,
      newCustomersOverTime: customerStats[0].map(item => ({ label: item._id, value: item.newCustomers })),
      newCustomersOverTimeDetailed: customerStats[0], // Keep detailed data
      topCustomers: customerStats[1],
      customerStatusDistribution: customerStats[2],
      summary: {
        totalNewCustomers: customerStats[0].reduce((sum, item) => sum + item.newCustomers, 0),
        avgLifetimeValue: customerStats[1].length > 0 
          ? customerStats[1].reduce((sum, customer) => sum + customer.totalSpent, 0) / customerStats[1].length 
          : 0
      }
    });
  } catch (error) {
    console.error('Get customer reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product reports
router.get('/products', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = { createdAt: { $gte: monthAgo } };
    }

    const productStats = await Promise.all([
      // Best selling products
      Order.aggregate([
        { 
          $match: {
            paymentStatus: 'completed',
            ...dateFilter
          }
        },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            totalSold: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $project: {
            name: '$product.name',
            category: '$product.category',
            price: '$product.price',
            stock: '$product.stock',
            totalSold: 1,
            revenue: 1
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 20 }
      ]),
      
      // Low stock products
      Product.find({ stock: { $lte: 10 }, isActive: true })
        .select('name category price stock')
        .sort({ stock: 1 }),
      
      // Product performance by category
      Product.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$category',
            productCount: { $sum: 1 },
            avgPrice: { $avg: '$price' },
            totalStock: { $sum: '$stock' }
          }
        }
      ])
    ]);

    res.json({
      period,
      bestSellingProducts: productStats[0],
      lowStockProducts: productStats[1],
      categoryPerformance: productStats[2],
      summary: {
        totalProductsSold: productStats[0].reduce((sum, item) => sum + item.totalSold, 0),
        totalRevenue: productStats[0].reduce((sum, item) => sum + item.revenue, 0),
        lowStockCount: productStats[1].length
      }
    });
  } catch (error) {
    console.error('Get product reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;