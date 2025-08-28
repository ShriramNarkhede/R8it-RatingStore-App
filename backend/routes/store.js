const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const { Store, Rating, User } = require('../models');

const router = express.Router();

// Dashboard: Average rating & rater list
router.get('/dashboard', authenticate, authorize('store-owner'), async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { ownerId: req.user.id },
      include: [{
        model: User,
        through: { attributes: ['rating'] },
        as: 'users',
        attributes: ['name', 'email']
      }]
    });

    if (!store) return res.status(404).json({ message: 'Store not found' });

    const ratings = store.users.map(u => u.Rating.rating);
    const average = ratings.length > 0
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
      : 0;

    res.json({
      storeName: store.name,
      averageRating: average,
      totalRatings: ratings.length,
      raters: store.users.map(u => ({
        name: u.name,
        email: u.email,
        rating: u.Rating.rating
      }))
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;