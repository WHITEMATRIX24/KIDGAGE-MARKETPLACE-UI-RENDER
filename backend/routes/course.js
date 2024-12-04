const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Route to search for a course by name
router.get('/search', async (req, res) => {
    try {
        const { name } = req.query;

        // Find course by name (case-insensitive search)
        const course = await Course.findOne({ name: { $regex: new RegExp(name, 'i') } });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to get courses by provider IDs
router.get('/by-providers', async (req, res) => {
    const { providerIds } = req.query;

    try {
        const courses = await Course.find({ providerId: { $in: providerIds } });
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/course/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Route to get courses by courseType
router.get('/by-course-type', async (req, res) => {
    const { courseType } = req.query;

    try {
        const courses = await Course.find({ courseType: courseType });
        res.status(200).json(courses);
    } catch (error) {
        console.error('Error fetching courses by courseType:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/lowest-fee/:category', async (req, res) => {
    try {
      const category = req.params.category;
  
      // Fetch all courses that match the given category name
      const courses = await Course.find({ courseType: category });
  
      if (courses.length === 0) {
        return res.status(404).json({ message: 'No courses found for this category.' });
      }
  
      // Extract the feeAmount and find the minimum
      const fees = courses.map(course => course.feeAmount);
      const minFee = Math.min(...fees);
  
      res.json({ minFee });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching lowest fee', error });
    }
  });
  
module.exports = router;
