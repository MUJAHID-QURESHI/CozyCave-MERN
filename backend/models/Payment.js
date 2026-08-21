const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
    amount: { type: Number, required: true }, // Store in sub-units (e.g. Paise for INR) or base currency
    currency: { type: String, default: 'USD' }, // Adjust to USD/INR depending on system requirements (CozyCave pricing is shown in USD in the frontend)
    status: {
      type: String,
      enum: ['created', 'paid', 'failed', 'refunded'],
      default: 'created',
    },
    method: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
