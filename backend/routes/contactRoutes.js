const express = require('express');
const router = express.Router();
const ContactMessage = require('../models/ContactMessage');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// @desc    Submit a contact message
// @route   POST /api/contacts
// @access  Public
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      phone,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Message saved successfully',
      data: newMessage
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contacts/admin
// @access  Private/Admin
router.get('/admin', protect, admin, async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
