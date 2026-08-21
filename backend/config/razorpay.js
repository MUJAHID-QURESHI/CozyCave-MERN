const Razorpay = require('razorpay');

const isConfigured = !!(
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET &&
  !process.env.RAZORPAY_KEY_ID.includes('yourkey')
);

let razorpayInstance = null;

if (isConfigured) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.warn('WARNING: Razorpay credentials not fully set in .env. Mock Payments will be used.');
}

module.exports = {
  razorpay: razorpayInstance,
  isConfigured,
};
