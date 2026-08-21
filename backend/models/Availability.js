const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    date: { type: String, required: true }, // Format: 'YYYY-MM-DD'
    status: {
      type: String,
      enum: ['available', 'booked', 'blocked'],
      default: 'available',
      required: true,
    },
    price: { type: Number, default: null },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
    blockedReason: { type: String, default: '' },
  },
  { timestamps: true }
);

// Unique compound index to prevent overlapping records for property and date
availabilitySchema.index({ property: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Availability', availabilitySchema);
