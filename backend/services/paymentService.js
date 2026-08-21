const crypto = require('crypto');
const Payment = require('../models/Payment');
const { razorpay, isConfigured } = require('../config/razorpay');

// Create Razorpay Order
const createRazorpayOrder = async (bookingId, amountUSD) => {
  // Convert USD to INR sub-units (1 USD = 83 INR, and Razorpay expects paise: * 100)
  const amountPaise = Math.round(amountUSD * 83 * 100);
  const forceMock = process.env.USE_MOCK_PAYMENTS === 'true';

  if (!forceMock && isConfigured && razorpay) {
    const options = {
      amount: amountPaise,
      currency: 'INR',
      receipt: `receipt_${bookingId}`,
    };

    const order = await razorpay.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      mock: false,
    };
  } else {
    // Return mock order details
    const mockOrderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`;
    return {
      orderId: mockOrderId,
      amount: amountUSD,
      currency: 'USD',
      mock: true,
    };
  }
};

// Verify Payment Signature
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const forceMock = process.env.USE_MOCK_PAYMENTS === 'true';

  if (forceMock || !isConfigured) {
    // In mock mode, validate successfully if a mock payment ID is provided
    return !!(paymentId && paymentId.startsWith('pay_'));
  }

  const text = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');

  return generatedSignature === signature;
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
};
