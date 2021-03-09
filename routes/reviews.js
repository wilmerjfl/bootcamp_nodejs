const router = require('express').Router({mergeParams: true});

const {
  getAllReviews,
  getReview,
  addReview,
} = require('../controllers/reviews');

const {protect, authorize} = require('../middleware/auth');
const Review = require('../models/Review');
const advancedResults = require('../middleware/advancedResults');

router.route('/').get(advancedResults(Review, {
  path: 'bootcamp',
  select: 'name description',
}), getAllReviews)
    .post(protect, authorize('user', 'admin'), addReview);

router.route('/:id').get(getReview);

module.exports = router;
