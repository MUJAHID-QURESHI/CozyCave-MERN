const Booking = require('../models/Booking');
const Availability = require('../models/Availability');
const Property = require('../models/Property');
const generateBookingId = require('../utils/generateBookingId');
const { checkAvailability, getDatesInRange } = require('./availabilityService');
const { calculatePrice } = require('./pricingService');
const { createNotification } = require('./notificationService');

const createPendingBooking = async (userId, payload) => {
  const { propertyId, checkIn, checkOut, guests, guestDetails } = payload;

  const property = await Property.findById(propertyId);
  if (!property || !property.isActive) {
    throw new Error('Property not found or is currently inactive.');
  }

  // 1. Check double bookings
  const isAvailable = await checkAvailability(propertyId, checkIn, checkOut);
  if (!isAvailable) {
    throw new Error('Selected dates are no longer available.');
  }

  // 2. Perform price calculations on server
  const pricing = await calculatePrice(checkIn, checkOut, property);
  if (pricing.numberOfNights <= 0) {
    throw new Error('Check-out date must be after check-in date.');
  }

  // 3. Generate booking ID
  const bookingId = await generateBookingId();

  // 4. Create the booking document in database
  const booking = await Booking.create({
    bookingId,
    customer: userId,
    property: propertyId,
    checkIn,
    checkOut,
    guests,
    numberOfNights: pricing.numberOfNights,
    pricePerNight: pricing.pricePerNight,
    subtotal: pricing.subtotal,
    cleaningFee: pricing.cleaningFee,
    serviceFee: pricing.serviceFee,
    tax: 0,
    totalAmount: pricing.totalAmount,
    paymentStatus: 'pending',
    bookingStatus: 'pending',
    guestDetails,
  });

  return booking;
};

const confirmBooking = async (bookingId, paymentInfo = {}) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found.');
  }

  if (booking.bookingStatus === 'confirmed') {
    return booking;
  }

  // Final confirmation check for dates
  const isAvailable = await checkAvailability(booking.property, booking.checkIn, booking.checkOut);
  if (!isAvailable) {
    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'failed';
    await booking.save();
    throw new Error('Dates became unavailable before payment completion.');
  }

  // Set booking status to confirmed and payment to paid
  booking.bookingStatus = 'confirmed';
  booking.paymentStatus = 'paid';
  await booking.save();

  // Mark availability status as booked
  const dates = getDatesInRange(booking.checkIn, booking.checkOut);
  const bulkOps = dates.map(date => ({
    updateOne: {
      filter: { property: booking.property, date: date },
      update: { $set: { status: 'booked', booking: booking._id } },
      upsert: true,
    }
  }));
  await Availability.bulkWrite(bulkOps);

  // Send notifications
  await createNotification(
    booking.customer,
    'Booking Confirmed!',
    `Your stay reservation is confirmed under ID ${booking.bookingId}`,
    'booking_confirmed'
  );

  return booking;
};

const cancelBookingByUser = async (userId, bookingId, reason = 'Cancelled by user') => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found.');
  }

  if (booking.customer.toString() !== userId.toString()) {
    throw new Error('Unauthorized to cancel this booking.');
  }

  if (booking.bookingStatus === 'cancelled') {
    return booking;
  }

  // Cancel booking
  booking.bookingStatus = 'cancelled';
  booking.cancellationReason = reason;
  
  if (booking.paymentStatus === 'paid') {
    booking.paymentStatus = 'refunded'; // Will trigger refund process later
  }
  
  await booking.save();

  // Free dates in Availability collection
  const dates = getDatesInRange(booking.checkIn, booking.checkOut);
  await Availability.deleteMany({
    property: booking.property,
    date: { $in: dates },
    status: 'booked',
    booking: booking._id,
  });

  // Notify customer
  await createNotification(
    booking.customer,
    'Booking Cancelled',
    `Your stay reservation ${booking.bookingId} has been successfully cancelled.`,
    'booking_cancelled'
  );

  return booking;
};

module.exports = {
  createPendingBooking,
  confirmBooking,
  cancelBookingByUser,
};
