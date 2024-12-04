// routes/personalRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const PersonalUser = require('../models/personalUser'); // Adjust the path as necessary

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, email, phoneNumber, password, firstName, lastName, confirmPassword, agreeTerms } = req.body;

  // Validate password
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match.' });
  }

  try {
    // Check if user with the same email or phone number already exists
    const existingUser = await PersonalUser.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or phone number already exists.' });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save new user
    const newUser = new PersonalUser({
      username,
      email,
      phoneNumber,
      password: hashedPassword,
      firstName,
      lastName,
      agreeTerms,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error saving user:', error);
    res.status(500).json({ message: 'Internal server error. Please try again later.' });
  }
});

// Sign-In Route
router.post('/signin', async (req, res) => {
  const { emailOrPhone, password } = req.body;

  try {
    // Find the user by email or phone number
    const user = await PersonalUser.findOne({
      $or: [{ email: emailOrPhone }, { phoneNumber: emailOrPhone }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Email/phone is incorrect' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    // Update user status
    user.isLoggedIn = true;
    await user.save();

    // Successful sign-in
    res.status(200).json({ message: 'Sign-in successful', user });
  } catch (err) {
    console.error('Sign-in error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
