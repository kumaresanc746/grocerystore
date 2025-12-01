const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products with filters
router.get('/products', async (req, res) => {
    try {
        const { category, search, limit } = req.query;
        let query = {};

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Search by name
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Execute query
        let productsQuery = Product.find(query);
        
        if (limit) {
            productsQuery = productsQuery.limit(parseInt(limit));
        }

        const products = await productsQuery.sort({ createdAt: -1 });

        res.json({
            success: true,
            products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single product
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;


