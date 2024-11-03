const express = require('express');
const Router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');

const { createReview, destroyReview } = require('../controllers/reviews.js');

// review (POST)
Router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// review (DELETE)
Router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(destroyReview));

module.exports = Router;