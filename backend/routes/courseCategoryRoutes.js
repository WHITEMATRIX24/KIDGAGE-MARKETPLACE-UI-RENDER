const express = require('express');
const CourseCategory = require('../models/CourseCategory'); // Adjust the path as necessary

const router = express.Router();

// Set up multer for file handling


router.get('/categories', async (req, res) => {
    try {
        const categories = await CourseCategory.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
