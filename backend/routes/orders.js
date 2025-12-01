const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authUser } = require('../middleware/auth');

// Create order
router.post('/order/create', authUser, async (req, res) => {
    try {
        const { shippingAddress, phone, paymentMethod } = req.body;
        if (!shippingAddress || !phone) {
            return res.status(400).json({ message: 'Shipping address and phone are required' });
        }
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }
        let totalAmount = 0;
        const orderItems = [];
        for (const item of cart.items) {
            const product = item.product;
            totalAmount += product.price * item.quantity;
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
            orderItems.push({ product: product._id, quantity: item.quantity, price: product.price });
        }
        totalAmount += 50;
        const order = new Order({
            orderNumber: `ORD-${Date.now()}`,
            user: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            phone,
            paymentMethod: paymentMethod || 'cod',
            status: 'pending'
        });
        await order.save();
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
        }
        cart.items = [];
        await cart.save();
        res.status(201).json({ success: true, order });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get order history
router.get('/order/history', authUser, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.product').sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.error('Get order history error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

