const express = require('express');
const SiteContent = require('../../models/SiteContent');
const { adminAuth } = require('../../middleware/auth');

const router = express.Router();

// Get all site content (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, type, position, isActive } = req.query;
    const query = {};

    // Apply filters
    if (type && type !== 'all') {
      query.type = type;
    }

    if (position && position !== 'all') {
      query.position = position;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const content = await SiteContent.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SiteContent.countDocuments(query);

    res.json({
      content,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get site content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public site content (public)
router.get('/public', async (req, res) => {
  try {
    const { type, position, category } = req.query;
    const query = {
      isActive: true,
      $or: [
        { publishAt: { $lte: new Date() } },
        { publishAt: null }
      ]
    };

    // Check expiration
    query.$and = [
      {
        $or: [
          { expireAt: { $gte: new Date() } },
          { expireAt: null }
        ]
      }
    ];

    if (type) {
      query.type = type;
    }

    if (position) {
      query.position = position;
    }

    if (category) {
      query.category = category;
    }

    const content = await SiteContent.find(query)
      .sort({ displayOrder: 1, createdAt: -1 })
      .select('-createdAt -updatedAt');

    res.json(content);
  } catch (error) {
    console.error('Get public site content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get content stats (admin only)
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const stats = await Promise.all([
      SiteContent.countDocuments(),
      SiteContent.countDocuments({ isActive: true }),
      SiteContent.countDocuments({ type: 'banner', isActive: true }),
      SiteContent.countDocuments({ type: 'collection', isActive: true }),
      SiteContent.countDocuments({ 
        expireAt: { $lt: new Date() }
      })
    ]);

    res.json({
      totalContent: stats[0],
      activeContent: stats[1],
      activeBanners: stats[2],
      activeCollections: stats[3],
      expiredContent: stats[4]
    });
  } catch (error) {
    console.error('Get content stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create site content (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const content = new SiteContent(req.body);
    await content.save();
    res.status(201).json(content);
  } catch (error) {
    console.error('Create site content error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Get single content (admin only)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const content = await SiteContent.findById(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update site content (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const content = await SiteContent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// Update content order (admin only)
router.put('/reorder/bulk', adminAuth, async (req, res) => {
  try {
    const { items } = req.body; // Array of { id, displayOrder }
    
    const updatePromises = items.map(item => 
      SiteContent.findByIdAndUpdate(
        item.id,
        { displayOrder: item.displayOrder },
        { new: true }
      )
    );

    await Promise.all(updatePromises);
    
    res.json({ message: 'Content order updated successfully' });
  } catch (error) {
    console.error('Update content order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete site content (admin only) - soft delete
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const content = await SiteContent.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ message: 'Content deactivated successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;