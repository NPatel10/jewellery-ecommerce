const express = require('express');
const Payment = require('../../models/Payment');
const Order = require('../../models/Order');
const { adminAuth, auth } = require('../../middleware/auth');

const router = express.Router();

// Get all payments (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      paymentMethod, 
      startDate, 
      endDate,
      minAmount,
      maxAmount
    } = req.query;
    
    let query = {};

    // Apply filters
    if (status && status !== 'all') {
      query.status = status;
    }

    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Amount range filter
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }

    const payments = await Payment.find(query)
      .populate('order', 'totalAmount status createdAt')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.json({
      payments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment stats (admin only)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    let dateFilter = {};
    
    if (period === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dateFilter = { createdAt: { $gte: today } };
    } else if (period === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      dateFilter = { createdAt: { $gte: weekAgo } };
    } else if (period === 'month') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      dateFilter = { createdAt: { $gte: monthAgo } };
    }

    const stats = await Promise.all([
      // Total revenue
      Payment.aggregate([
        { $match: { status: 'completed', ...dateFilter } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      // Payment count by status
      Payment.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      // Payment method distribution
      Payment.aggregate([
        { $match: { status: 'completed', ...dateFilter } },
        { $group: { _id: '$paymentMethod', count: { $sum: 1 }, total: { $sum: '$amount' } } }
      ]),
      // Daily revenue (last 30 days)
      Payment.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    const totalRevenue = stats[0][0]?.total || 0;
    const statusCounts = {};
    stats[1].forEach(item => {
      statusCounts[item._id] = item.count;
    });

    res.json({
      totalRevenue,
      statusCounts,
      paymentMethods: stats[2],
      dailyRevenue: stats[3],
      period
    });
  } catch (error) {
    console.error('Get payment stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single payment (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('order')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create payment for order
router.post('/', auth, async (req, res) => {
  try {
    const { 
      orderId, 
      paymentMethod, 
      paymentGateway = 'mock',
      transactionId,
      cardLast4,
      cardBrand
    } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if payment already exists for this order
    const existingPayment = await Payment.findOne({ order: orderId });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already exists for this order' });
    }

    // Create payment
    const payment = new Payment({
      order: orderId,
      user: order.user,
      amount: order.totalAmount,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      shippingAmount: order.shippingAmount,
      discountAmount: order.discountAmount,
      paymentMethod,
      paymentGateway,
      transactionId,
      cardLast4,
      cardBrand,
      status: paymentGateway === 'mock' ? 'completed' : 'pending'
    });

    await payment.save();

    // Update order payment status
    if (payment.status === 'completed') {
      order.paymentStatus = 'completed';
      await order.save();
    }

    res.status(201).json(payment);
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update payment status (admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status, failureReason, gatewayResponse } = req.body;
    
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        failureReason: status === 'failed' ? failureReason : undefined,
        gatewayResponse
      },
      { new: true, runValidators: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update order payment status
    const order = await Order.findById(payment.order);
    if (order) {
      order.paymentStatus = status;
      await order.save();
    }

    res.json(payment);
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Process refund (admin only)
router.post('/:id/refund', adminAuth, async (req, res) => {
  try {
    const { amount, reason } = req.body;
    
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ message: 'Can only refund completed payments' });
    }

    const totalRefunded = payment.refundedAmount || 0;
    if (totalRefunded + amount > payment.amount) {
      return res.status(400).json({ message: 'Refund amount exceeds payment amount' });
    }

    // Add refund record
    payment.refunds.push({
      amount,
      reason,
      refundTransactionId: `refund_${Date.now()}`
    });

    payment.refundedAmount = totalRefunded + amount;
    
    // Update status
    if (payment.refundedAmount >= payment.amount) {
      payment.status = 'refunded';
    } else {
      payment.status = 'partially_refunded';
    }

    await payment.save();

    res.json({
      message: 'Refund processed successfully',
      payment
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;