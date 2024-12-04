const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');

// Route to get all banners
router.get('/', async (req, res) => {
    try {
        const banners = await Banner.find();
        res.json(banners);
    } catch (error) {
        console.error('Error fetching banners:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

module.exports = router;

