const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getMyFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getMyFavorites);

router.route('/:propertyId')
  .post(addFavorite)
  .delete(removeFavorite);

module.exports = router;
