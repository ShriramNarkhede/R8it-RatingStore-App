const express = require('express');
const { authenticate } = require('../middlewares/auth');
const { User, Store, Rating } = require('../models');
const Joi = require('joi');

const router = express.Router();

// Update password
router.put('/password', authenticate, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { id } = req.user;

  const user = await User.findByPk(id);
  const isMatch = await require('../utils/auth').comparePassword(currentPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Current password incorrect' });

  const { error } = Joi.object({
    newPassword: Joi.string()
      .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)
      .required()
  }).validate({ newPassword });

  if (error) return res.status(400).json({ message: error.details[0].message });

  user.password = await require('../utils/auth').hashPassword(newPassword);
  await user.save();
  res.json({ message: 'Password updated' });
});

// List all stores (with search)
router.get('/stores', authenticate, async (req, res) => {
  const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
  const { Op } = require('sequelize');
  const sequelize = require('../config/database');

  try {
    const dialect = sequelize.getDialect && sequelize.getDialect();
    const likeOp = dialect === 'postgres' ? Op.iLike : Op.like;

    const where = {};
    if (name) where.name = { [likeOp]: `%${name}%` };
    if (address) where.address = { [likeOp]: `%${address}%` };

    const stores = await Store.findAll({
      where,
      order: [[sortBy, order]],
      attributes: ['id', 'name', 'address', 'rating']
    });

    // Add user's rating if logged in
    const userId = req.user.id;
    const ratings = await Rating.findAll({
      where: { userId },
      include: [Store]
    });

    const userRatingsMap = {};
    ratings.forEach(r => {
      if (r && r.Store) {
        userRatingsMap[r.Store.id] = r.rating;
      }
    });

    const result = stores.map(store => ({
      ...store.toJSON(),
      userRating: userRatingsMap[store.id] || null
    }));

    res.json(result);
  } catch (err) {
    console.error('GET /api/user/stores failed:', err);
    res.status(500).json({ message: err.message });
  }
});

// Submit or update rating
router.post('/rating', authenticate, async (req, res) => {
  const { storeId, rating } = req.body;
  const userId = req.user.id;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be 1-5' });
  }

  try {
    let userRating = await Rating.findOne({ where: { userId, storeId } });

    if (userRating) {
      userRating.rating = rating;
      await userRating.save();
    } else {
      userRating = await Rating.create({ userId, storeId, rating });
    }

    // Recalculate store average
    const ratings = await Rating.findAll({ where: { storeId }, attributes: ['rating'] });
    const avg = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
    const store = await Store.findByPk(storeId);
    store.rating = avg.toFixed(2);
    await store.save();

    res.json({ message: 'Rating submitted', rating: userRating.rating });
  } catch (err) {
    console.error('POST /api/user/rating failed:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;