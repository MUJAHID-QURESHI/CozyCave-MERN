const express = require('express');
const router = express.Router();
const {
  getPropertyAvailability,
  checkDatesAvailability,
  blockPropertyDates,
  unblockPropertyDates,
  setPropertyDatePrice,
} = require('../controllers/availabilityController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.post('/block', protect, admin, blockPropertyDates);
router.delete('/block', protect, admin, unblockPropertyDates);
router.post('/price', protect, admin, setPropertyDatePrice);
router.get('/:propertyId', getPropertyAvailability);
router.get('/:propertyId/check', checkDatesAvailability);

module.exports = router;
