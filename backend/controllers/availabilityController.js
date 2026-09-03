const Availability = require('../models/Availability');
const { checkAvailability, blockDates, unblockDates } = require('../services/availabilityService');

// @desc    Get property availability dates status (booked or blocked)
// @route   GET /api/availability/:propertyId
// @access  Public
const getPropertyAvailability = async (req, res, next) => {
  try {
    const list = await Availability.find({
      property: req.params.propertyId,
      $or: [
        { status: { $in: ['booked', 'blocked'] } },
        { price: { $exists: true, $ne: null } }
      ]
    });

    // Also include dates from confirmed & pending bookings
    const Booking = require('../models/Booking');
    const { getDatesInRange } = require('../services/availabilityService');
    const activeBookings = await Booking.find({
      property: req.params.propertyId,
      bookingStatus: { $in: ['confirmed', 'pending'] }
    });

    const bookedDateSet = new Set(list.filter(i => i.status === 'booked' || i.status === 'blocked').map(i => i.date));
    const additionalBookedItems = [];

    activeBookings.forEach(b => {
      const bDates = getDatesInRange(b.checkIn, b.checkOut);
      const coDate = new Date(b.checkOut).toISOString().split('T')[0];
      if (!bDates.includes(coDate)) {
        bDates.push(coDate);
      }
      bDates.forEach(d => {
        if (!bookedDateSet.has(d)) {
          bookedDateSet.add(d);
          additionalBookedItems.push({
            property: req.params.propertyId,
            date: d,
            status: 'booked',
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      message: 'Availability data fetched successfully',
      data: [...list, ...additionalBookedItems],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check dates range availability
// @route   GET /api/availability/:propertyId/check
// @access  Public
const checkDatesAvailability = async (req, res, next) => {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) {
      res.status(400);
      throw new Error('Please select check-in and check-out dates');
    }

    const available = await checkAvailability(req.params.propertyId, checkIn, checkOut);

    res.status(200).json({
      success: true,
      message: available ? 'Dates are available' : 'Dates are not available',
      data: { available },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually block dates (Admin only)
// @route   POST /api/availability/block
// @access  Private/Admin
const blockPropertyDates = async (req, res, next) => {
  try {
    const { propertyId, dates, reason } = req.body;
    if (!propertyId || !dates || !dates.length) {
      res.status(400);
      throw new Error('Property ID and dates are required');
    }

    await blockDates(propertyId, dates, reason);

    res.status(200).json({
      success: true,
      message: 'Dates blocked successfully',
      data: { dates },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Manually unblock a date (Admin only)
// @route   DELETE /api/availability/block
// @access  Private/Admin
const unblockPropertyDates = async (req, res, next) => {
  try {
    const { propertyId, date } = req.body;
    if (!propertyId || !date) {
      res.status(400);
      throw new Error('Property ID and date are required');
    }

    await unblockDates(propertyId, date);

    res.status(200).json({
      success: true,
      message: 'Date unblocked successfully',
      data: { date },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Set custom price for a date (Admin only)
// @route   POST /api/availability/price
// @access  Private/Admin
const setPropertyDatePrice = async (req, res, next) => {
  try {
    const { propertyId, date, price } = req.body;
    if (!propertyId || !date) {
      res.status(400);
      throw new Error('Property ID and date are required');
    }

    const updated = await Availability.findOneAndUpdate(
      { property: propertyId, date: date },
      { 
        $set: { 
          price: price ? parseFloat(price) : undefined 
        } 
      },
      { upsert: true, new: true }
    );

    if (!updated.price && updated.status === 'available') {
      await Availability.findByIdAndDelete(updated._id);
    }

    res.status(200).json({
      success: true,
      message: price ? 'Custom price set successfully' : 'Custom price removed successfully',
      data: { date, price: price ? parseFloat(price) : null }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPropertyAvailability,
  checkDatesAvailability,
  blockPropertyDates,
  unblockPropertyDates,
  setPropertyDatePrice,
};
