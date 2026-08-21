const express = require('express');
const router = express.Router();
const {
  createNewBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(createNewBooking);

router.get('/my', getMyBookings);

router.route('/:id')
  .get(getBookingById);

router.patch('/:id/cancel', cancelBooking);

module.exports = router;
