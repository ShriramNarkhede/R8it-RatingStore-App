const express = require('express');
const { registerValidation, loginValidation } = require('../utils/validations');
const { hashPassword, comparePassword } = require('../utils/auth'); // ✅ Now it will work
const { User } = require('../models');
const { generateToken } = require('../middlewares/auth'); // w
const router = express.Router();

// Register (Normal User)
router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, password, address } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await hashPassword(password);
    const user = await User.create({
      name, email, password: hashed, address, role: 'user'
    });

    const token = generateToken(user.id, user.role);
    res.json({ token, user: { id: user.id, name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(user.id, user.role);
    res.json({ token, user: { id: user.id, name: user.name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;