 // Admin Login (deferred require to avoid model init/circular issues)
router.post('/admin/login', async (req, res) => {
  try {
    // require the model here (defer to avoid circular require / incomplete export issues)
    let Admin;
    try {
      Admin = require('../models/Admin');
    } catch (reqErr) {
      console.error('Require Admin failed:', reqErr);
      return res.status(500).json({ message: 'Server configuration error (Admin model).' });
    }

    // defensive: ensure Admin is a mongoose model
    if (!Admin || typeof Admin.findOne !== 'function') {
      console.error('Admin model invalid:', Admin);
      return res.status(500).json({ message: 'Server configuration error (Admin model).' });
    }

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = (email || '').toLowerCase().trim();

    // find admin (exact first, fallback to case-insensitive)
    let admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      admin = await Admin.findOne({ email: { $regex: `^${normalizedEmail}$`, $options: 'i' } });
    }

    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      success: true,
      token,
      admin: { _id: admin._id, name: admin.name, email: admin.email }
    });
  } catch (err) {
    console.error('Admin login error:', err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Server error' });
  }
});
