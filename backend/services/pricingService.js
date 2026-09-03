const Availability = require('../models/Availability');
const { getDatesInRange } = require('./availabilityService');

const calculateNights = (checkInDate, checkOutDate) => {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const diff = end.getTime() - start.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
};

const calculatePrice = async (checkInDate, checkOutDate, property) => {
  const nights = calculateNights(checkInDate, checkOutDate);
  const basePrice = property.pricePerNight || property.price;

  if (nights <= 0) {
    return {
      numberOfNights: 0,
      pricePerNight: basePrice,
      subtotal: 0,
      cleaningFee: 0,
      serviceFee: 0,
      tax: 0,
      totalAmount: 0,
    };
  }

  const dates = getDatesInRange(checkInDate, checkOutDate);

  const customAvails = await Availability.find({
    property: property._id || property.id,
    date: { $in: dates }
  });

  let subtotal = 0;
  dates.forEach(date => {
    // date is a string YYYY-MM-DD
    const match = customAvails.find(a => a.date === date);
    if (match && match.price) {
      subtotal += match.price;
    } else {
      subtotal += basePrice;
    }
  });

  const cleaningFee = 0;
  const serviceFee = Math.round(subtotal * 0.08);
  const tax = 0;
  const totalAmount = subtotal + serviceFee;

  return {
    numberOfNights: nights,
    pricePerNight: basePrice,
    subtotal,
    cleaningFee: 0,
    serviceFee,
    tax: 0,
    totalAmount,
  };
};

module.exports = {
  calculateNights,
  calculatePrice,
};
