const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    cleanliness: { type: Number, min: 1, max: 5, default: 5 },
    location: { type: Number, min: 1, max: 5, default: 5 },
    comfort: { type: Number, min: 1, max: 5, default: 5 },
    service: { type: Number, min: 1, max: 5, default: 5 },
    comment: { type: String, required: true, trim: true },
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
