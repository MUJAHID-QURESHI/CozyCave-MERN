const express = require('express');
const router = express.Router();
const {
  getAllBookings,
  getAdminBookingById,
  updateBookingStatus,
  getCustomersDirectory,
  getCustomerDetails,
  getDashboardStats,
  getRevenueReport,
  deleteBooking,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.use(protect);
router.use(admin);

router.get('/dashboard', getDashboardStats);
router.get('/bookings', getAllBookings);
router.route('/bookings/:id')
  .get(getAdminBookingById)
  .patch(updateBookingStatus)
  .delete(deleteBooking);

router.get('/customers', getCustomersDirectory);
router.get('/customers/:id', getCustomerDetails);
router.get('/revenue', getRevenueReport);

module.exports = router;
