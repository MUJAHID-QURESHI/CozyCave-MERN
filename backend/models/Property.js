const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      pincode: { type: String },
      latitude: { type: Number },
      longitude: { type: Number },
      googleMapUrl: { type: String },
    },
    pricePerNight: { type: Number, required: true },
    maxGuests: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    beds: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    amenities: [{ type: String }],
    houseRules: [{ type: String }],
    checkInTime: { type: String, default: '03:00 PM' },
    checkOutTime: { type: String, default: '11:00 AM' },
    cancellationPolicy: { type: String, default: 'Flexible cancellation.' },
    rating: { type: Number, default: 5.0 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
