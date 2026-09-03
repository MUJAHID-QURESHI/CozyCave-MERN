const Availability = require('../models/Availability');

// Get all dates within range (inclusive of start, exclusive of end date)
const getDatesInRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates = [];
  
  let current = new Date(start);
  while (current < end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

// Check if a property is available for a date range
const checkAvailability = async (propertyId, checkIn, checkOut) => {
  const requiredDates = getDatesInRange(checkIn, checkOut);
  if (requiredDates.length === 0) return false;

  // 1. Find any records that match the property and dates with status booked or blocked
  const conflicts = await Availability.find({
    property: propertyId,
    date: { $in: requiredDates },
    status: { $in: ['booked', 'blocked'] },
  });

  if (conflicts.length > 0) return false;

  // 2. Strict overlap check against active reservations
  const Booking = require('../models/Booking');
  const reqStart = new Date(checkIn);
  const reqEnd = new Date(checkOut);

  const existingBookingConflict = await Booking.findOne({
    property: propertyId,
    bookingStatus: { $in: ['confirmed', 'pending'] },
    checkIn: { $lt: reqEnd },
    checkOut: { $gt: reqStart },
  });

  return !existingBookingConflict;
};

// Block dates manually (admin)
const blockDates = async (propertyId, dates, reason = 'Blocked by administrator') => {
  const bulkOps = dates.map(date => ({
    updateOne: {
      filter: { property: propertyId, date: date },
      update: { $set: { status: 'blocked', blockedReason: reason } },
      upsert: true,
    }
  }));

  return await Availability.bulkWrite(bulkOps);
};

// Unblock dates manually (admin)
const unblockDates = async (propertyId, date) => {
  return await Availability.deleteOne({
    property: propertyId,
    date: date,
    status: 'blocked',
  });
};

module.exports = {
  getDatesInRange,
  checkAvailability,
  blockDates,
  unblockDates,
};
