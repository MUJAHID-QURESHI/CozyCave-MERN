const express = require('express');
const router = express.Router();
const {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  togglePropertyStatus,
  getPropertyPricingBreakdown,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.route('/')
  .get(getProperties)
  .post(protect, admin, createProperty);

router.route('/:id')
  .get(getPropertyById)
  .put(protect, admin, updateProperty)
  .delete(protect, admin, deleteProperty);

router.patch('/:id/status', protect, admin, togglePropertyStatus);
router.get('/:id/pricing', getPropertyPricingBreakdown);

module.exports = router;
