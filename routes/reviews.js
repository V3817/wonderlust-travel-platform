const express = require('express');
const router = express.Router({ mergeParams: true });
const reviewController = require('../controllers/reviewController');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middlewares');

// Reviews Routes - Grouped using router.route()
router.route('/')
    .post(isLoggedIn, validateReview, reviewController.createReview);

// Individual Review Routes - Grouped using router.route()
router.route('/:reviewId')
    .delete(isLoggedIn, isReviewAuthor, reviewController.destroyReview);

module.exports = router;

