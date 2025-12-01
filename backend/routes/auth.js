const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const { JWT_SECRET } = require('../middleware/auth');

// ---------------------
// User Signup
// ---------------------
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, address } = req.body;
    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email: email.toLowerCase().trim(), password, address });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, address: user.address }
    });
  } catch (err) {
    console.error('Signup error:', err.stack || err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------
// User Login
// ---------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, address: user.address }
    });
  } catch (err) {
    console.error('Login error:', err.stack || err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------------------
// Admin Login
// ---------------------
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      success: true,
      token,
      admin: { _id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.error('Admin login error:', err.stack || err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
