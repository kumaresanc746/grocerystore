const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authUser } = require('../middleware/auth');

// Update user profile
router.put('/user/update', authUser, async (req, res) => {
    try {
        const { name, email, address } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields
        if (name) user.name = name;
        if (email) {
            // Check if email is already taken by another user
            const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            user.email = email;
        }
        if (address) user.address = address;

        await user.save();

        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                address: user.address
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;


