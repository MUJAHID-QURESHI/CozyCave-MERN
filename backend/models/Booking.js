const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: {
      adults: { type: Number, default: 1, required: true },
      children: { type: Number, default: 0 },
    },
    numberOfNights: { type: Number, required: true },
    pricePerNight: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    cleaningFee: { type: Number, default: 0 },
    serviceFee: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    bookingStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },
    guestDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      mobile: { type: String, required: true },
    },
    cancellationReason: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
