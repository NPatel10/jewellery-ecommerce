const express = require('express');
const Coupon = require('../../models/Coupon');
const { adminAuth } = require('../../middleware/auth');

const router = express.Router();

// Get all coupons (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status, type } = req.query;
    const query = {};

    // Apply filters
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (status === 'active') {
      query.isActive = true;
      query.validFrom = { $lte: new Date() };
      query.validUntil = { $gte: new Date() };
    } else if (status === 'expired') {
      query.validUntil = { $lt: new Date() };
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    if (type && type !== 'all') {
      query.type = type;
    }

    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Coupon.countDocuments(query);

    res.json({
      coupons,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get coupon stats (admin only)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const stats = await Promise.all([
      Coupon.countDocuments(),
      Coupon.countDocuments({ isActive: true, validFrom: { $lte: now }, validUntil: { $gte: now } }),
      Coupon.countDocuments({ validUntil: { $lt: now } }),
      Coupon.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, totalUsage: { $sum: '$usedCount' } } }
      ])
    ]);

    res.json({
      totalCoupons: stats[0],
      activeCoupons: stats[1],
      expiredCoupons: stats[2],
      totalUsage: stats[3][0]?.totalUsage || 0
    });
  } catch (error) {
    console.error('Get coupon stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create coupon (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    console.error('Create coupon error:', error);
    if (error.code === 11000) {
      res.status(400).json({ message: 'Coupon code already exists' });
    } else {
      res.status(500).json({ message: error.message || 'Server error' });
    }
  }
});

// Get single coupon (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.json(coupon);
  } catch (error) {
    console.error('Get coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update coupon (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json(coupon);
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Delete coupon (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ message: 'Coupon deactivated successfully' });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Validate coupon (public - for checkout)
router.post('/validate', async (req, res) => {
  try {
    const { code, orderAmount, categories } = req.body;
    
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });

    if (!coupon) {
      return res.status(400).json({ message: 'Invalid or expired coupon code' });
    }

    // Check minimum order amount
    if (orderAmount < coupon.minOrderAmount) {
      return res.status(400).json({ 
        message: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon` 
      });
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit exceeded' });
    }

    // Check applicable categories
    if (coupon.applicableCategories.length > 0 && categories) {
      const hasApplicableCategory = categories.some(cat => 
        coupon.applicableCategories.includes(cat)
      );
      if (!hasApplicableCategory) {
        return res.status(400).json({ 
          message: 'Coupon not applicable to items in your cart' 
        });
      }
    }

    // Calculate discount
    let discountAmount = 0;
    if (coupon.type === 'percentage') {
      discountAmount = (orderAmount * coupon.value) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.value;
    }

    // Ensure discount doesn't exceed order amount
    discountAmount = Math.min(discountAmount, orderAmount);

    res.json({
      valid: true,
      coupon: {
        id: coupon._id,
        code: coupon.code,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value
      },
      discountAmount,
      finalAmount: orderAmount - discountAmount
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;