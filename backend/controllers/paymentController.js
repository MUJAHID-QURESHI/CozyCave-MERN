const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const { createRazorpayOrder, verifyPaymentSignature } = require('../services/paymentService');
const { confirmBooking } = require('../services/bookingService');

// @desc    Create Razorpay order for booking
// @route   POST /api/payments/create-order
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      res.status(400);
      throw new Error('Booking ID is required');
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    if (booking.bookingStatus !== 'pending') {
      res.status(400);
      throw new Error(`Booking cannot be paid. Status is ${booking.bookingStatus}`);
    }

    const orderData = await createRazorpayOrder(bookingId, booking.totalAmount);

    // Save payment intent
    await Payment.create({
      booking: booking._id,
      razorpayOrderId: orderData.orderId,
      amount: booking.totalAmount,
      currency: orderData.currency,
      status: 'created',
    });

    res.status(200).json({
      success: true,
      message: 'Razorpay order created successfully',
      data: {
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        mock: orderData.mock,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payments/verify
// @access  Private
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      res.status(400);
      throw new Error('Order ID and Payment ID are required');
    }

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      res.status(400);
      throw new Error('Invalid payment signature');
    }

    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment) {
      res.status(404);
      throw new Error('Payment transaction not found for this order');
    }

    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature || 'mock_signature';
    payment.status = 'paid';
    await payment.save();

    const booking = await confirmBooking(payment.booking);

    res.status(200).json({
      success: true,
      message: 'Payment verified and booking confirmed successfully',
      data: {
        bookingId: booking.bookingId,
        paymentStatus: booking.paymentStatus,
        bookingStatus: booking.bookingStatus,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Razorpay Webhook for payment events
// @route   POST /api/payments/webhook
// @access  Public
const handleWebhook = async (req, res, next) => {
  try {
    const event = req.body;
    console.log('Razorpay Webhook Event Received:', event.event);

    if (event.event === 'payment.captured') {
      const { order_id, id: payment_id } = event.payload.payment.entity;

      const payment = await Payment.findOne({ razorpayOrderId: order_id });
      if (payment && payment.status !== 'paid') {
        payment.status = 'paid';
        payment.razorpayPaymentId = payment_id;
        await payment.save();

        await confirmBooking(payment.booking);
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get payment details for a booking
// @route   GET /api/payments/:bookingId
// @access  Private
const getPaymentDetails = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId })
      .populate('booking');

    if (!payment) {
      res.status(404);
      throw new Error('No payment details found for this booking');
    }

    res.status(200).json({
      success: true,
      message: 'Payment details fetched successfully',
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  handleWebhook,
  getPaymentDetails,
};
