const { Op } = require('sequelize');
const express = require('express');
const { authenticate, authorize } = require('../middlewares/auth');
const { User, Store } = require('../models');

const router = express.Router();

// Add new user (admin/store-owner/user)
router.post('/users', authenticate, authorize('admin'), async (req, res) => {
  const { error } = require('../utils/validations').registerValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, password, address, role = 'user' } = req.body;
  if (!['admin', 'user', 'store-owner'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email exists' });

    const hashed = await require('../utils/auth').hashPassword(password);
    const user = await User.create({ name, email, password: hashed, address, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new store
router.post('/stores', authenticate, authorize('admin'), async (req, res) => {
  const { error } = require('../utils/validations').storeValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, address } = req.body;
  try {
    const store = await Store.create({ name, email, address });
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign an owner to a store
router.put('/stores/:id/owner', authenticate, authorize('admin'), async (req, res) => {
  const { ownerId } = req.body;
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ message: 'Store not found' });
    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== 'store-owner') {
      return res.status(400).json({ message: 'ownerId must be a valid store-owner' });
    }
    store.ownerId = ownerId;
    await store.save();
    res.json({ message: 'Owner assigned', store });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dashboard stats
router.get('/dashboard', authenticate, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await require('../models').Rating.count();

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all users with filter & sort
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
  const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;
  const sequelize = require('../config/database');
  const dialect = sequelize.getDialect && sequelize.getDialect();
  const likeOp = dialect === 'postgres' ? Op.iLike : Op.like;

  const where = {};
  if (name) where.name = { [likeOp]: `%${name}%` };
  if (email) where.email = { [likeOp]: `%${email}%` };
  if (address) where.address = { [likeOp]: `%${address}%` };
  if (role) where.role = role;

  try {
    const users = await User.findAll({
      where,
      order: [[sortBy, order]],
      attributes: ['id', 'name', 'email', 'address', 'role']
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// List all stores
router.get('/stores', authenticate, authorize('admin'), async (req, res) => {
  const { name, email, address, sortBy = 'name', order = 'ASC' } = req.query;
  const sequelize = require('../config/database');
  const dialect = sequelize.getDialect && sequelize.getDialect();
  const likeOp = dialect === 'postgres' ? Op.iLike : Op.like;

  const where = {};
  if (name) where.name = { [likeOp]: `%${name}%` };
  if (email) where.email = { [likeOp]: `%${email}%` };
  if (address) where.address = { [likeOp]: `%${address}%` };

  try {
    const stores = await Store.findAll({
      where,
      order: [[sortBy, order]],
      include: [{
        model: User,
        as: 'owner',
        attributes: ['name', 'email']
      }]
    });
    res.json(stores);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;