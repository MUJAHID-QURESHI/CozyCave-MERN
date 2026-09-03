const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Property = require('../models/Property');

// Helper to update rating
const updatePropertyRating = async (propertyId) => {
  const reviews = await Review.find({ property: propertyId, isVisible: true });
  const reviewCount = reviews.length;
  
  let rating = 5.0;
  if (reviewCount > 0) {
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    rating = parseFloat((sum / reviewCount).toFixed(2));
  }

  await Property.findByIdAndUpdate(propertyId, {
    rating,
    reviewCount,
  });
};

// @desc    Submit a review
// @route   POST /api/reviews
// @access  Private
const submitReview = async (req, res, next) => {
  try {
    const { propertyId, rating, comment, cleanliness, location, comfort, service } = req.body;

    if (!propertyId || !rating || !comment) {
      res.status(400);
      throw new Error('Property ID, rating and comment are required fields');
    }

    // Check if checkout date is in the past for confirmed or completed bookings
    const now = new Date();
    const hasStayed = await Booking.findOne({
      customer: req.user._id,
      property: propertyId,
      bookingStatus: { $in: ['confirmed', 'completed'] },
      checkOut: { $lt: now },
    });

    if (!hasStayed) {
      res.status(400);
      throw new Error('Only guests who have completed a stay at this property can leave a review.');
    }

    const alreadyReviewed = await Review.findOne({
      customer: req.user._id,
      booking: hasStayed._id,
    });

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('You have already submitted a review for this stay.');
    }

    const review = await Review.create({
      customer: req.user._id,
      property: propertyId,
      booking: hasStayed._id,
      rating,
      cleanliness: cleanliness || rating,
      location: location || rating,
      comfort: comfort || rating,
      service: service || rating,
      comment,
    });

    await updatePropertyRating(propertyId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a property
// @route   GET /api/reviews/property/:propertyId
// @access  Public
const getPropertyReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId, isVisible: true })
      .populate('customer', 'name avatar profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Property reviews fetched successfully',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    if (review.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to edit this review');
    }

    review.rating = req.body.rating !== undefined ? req.body.rating : review.rating;
    review.comment = req.body.comment || review.comment;
    review.cleanliness = req.body.cleanliness !== undefined ? req.body.cleanliness : review.cleanliness;
    review.location = req.body.location !== undefined ? req.body.location : review.location;
    review.comfort = req.body.comfort !== undefined ? req.body.comfort : review.comfort;
    review.service = req.body.service !== undefined ? req.body.service : review.service;
    if (req.body.isVisible !== undefined) {
      review.isVisible = !!req.body.isVisible;
    }

    const updatedReview = await review.save();

    await updatePropertyRating(review.property);

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    if (review.customer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this review');
    }

    const propertyId = review.property;
    await Review.findByIdAndDelete(req.params.id);

    await updatePropertyRating(propertyId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitReview,
  getPropertyReviews,
  updateReview,
  deleteReview,
};
