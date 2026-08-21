const Booking = require('../models/Booking');
const { createPendingBooking, cancelBookingByUser } = require('../services/bookingService');

// @desc    Create a new pending booking
// @route   POST /api/bookings
// @access  Private
const createNewBooking = async (req, res, next) => {
  try {
    const booking = await createPendingBooking(req.user._id, req.body);

    res.status(201).json({
      success: true,
      message: 'Pending booking created successfully. Proceed to payment.',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('property')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'User bookings fetched successfully',
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('property')
      .populate('customer', 'name email mobile');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    // Auth ownership check
    if (booking.customer._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this booking');
    }

    res.status(200).json({
      success: true,
      message: 'Booking details fetched successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PATCH /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const booking = await cancelBookingByUser(req.user._id, req.params.id, reason);

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
};
