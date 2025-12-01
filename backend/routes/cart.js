const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authUser } = require('../middleware/auth');

// Get user's cart
router.get('/cart', authUser, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
            await cart.save();
        }

        res.json({
            success: true,
            cart
        });
    } catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add item to cart
router.post('/cart/add', authUser, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check stock
        if (product.stock < (quantity || 1)) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        // Find or create cart
        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Check if item already exists in cart
        const itemIndex = cart.items.findIndex(
            item => item.product.toString() === productId
        );

        if (itemIndex > -1) {
            // Update quantity
            cart.items[itemIndex].quantity = quantity || cart.items[itemIndex].quantity + 1;
        } else {
            // Add new item
            cart.items.push({ product: productId, quantity: quantity || 1 });
        }

        await cart.save();
        await cart.populate('items.product');

        res.json({
            success: true,
            cart
        });
    } catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove item from cart
router.post('/cart/remove', authUser, async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();
        await cart.populate('items.product');

        res.json({
            success: true,
            cart
        });
    } catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;


