const Favorite = require('../models/Favorite');

// @desc    Add property to favorites
// @route   POST /api/favorites/:propertyId
// @access  Private
const addFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    const exists = await Favorite.findOne({ user: req.user._id, property: propertyId });
    if (exists) {
      return res.status(200).json({
        success: true,
        message: 'Property is already in favorites',
        data: exists,
      });
    }

    const favorite = await Favorite.create({
      user: req.user._id,
      property: propertyId,
    });

    res.status(201).json({
      success: true,
      message: 'Property added to favorites successfully',
      data: favorite,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/favorites/:propertyId
// @access  Private
const removeFavorite = async (req, res, next) => {
  try {
    const { propertyId } = req.params;

    await Favorite.findOneAndDelete({ user: req.user._id, property: propertyId });

    res.status(200).json({
      success: true,
      message: 'Property removed from favorites successfully',
      data: { propertyId },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id })
      .populate('property');

    res.status(200).json({
      success: true,
      message: 'Favorites fetched successfully',
      data: favorites,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getMyFavorites,
};
