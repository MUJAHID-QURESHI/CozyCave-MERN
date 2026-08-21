const Booking = require('../models/Booking');

const generateBookingId = async () => {
  const year = new Date().getFullYear();
  
  let attempts = 0;
  while (attempts < 50) {
    const randomNum = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
    const bookingId = `CC-${year}-${randomNum}`;
    const exists = await Booking.findOne({ bookingId });
    if (!exists) {
      return bookingId;
    }
    attempts++;
  }
  return `CC-${year}-${Date.now()}`;
};

module.exports = generateBookingId;
