const express = require('express');
const router = express.Router();
const {
  submitReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, submitReview);

router.get('/property/:propertyId', getPropertyReviews);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

module.exports = router;
