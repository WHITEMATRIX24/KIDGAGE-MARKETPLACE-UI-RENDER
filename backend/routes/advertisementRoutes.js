const express = require('express');
const router = express.Router();
const Advertisement = require('../models/Advertisement'); // Adjust path as necessary

// Fetch all advertisements
router.get('/', async (req, res) => {
    try {
        const advertisements = await Advertisement.find();
        res.status(200).json(advertisements);
    } catch (error) {
        console.error('Error fetching advertisements:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;
