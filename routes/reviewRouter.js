const express = require('express');
const Router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');

// Middleware: Validate Review
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(400, errorMessage);

    } else {
        next();
    }
}

// review (POST)
Router.post("/", wrapAsync(async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        console.log("new review saved");
        res.redirect(`/listings/${listing._id}`);

    } catch (e) {
        console.error(e);
        res.status(500).send('Error adding review');
    }
}));

// review (DELETE)
Router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });  // the review is removed from the listing
    // '$pull' operator removes form an exising array of all instances of a value that match a specified condition

    await Review.findByIdAndDelete(reviewId); // the review is deleted as well

    res.redirect(`/listings/${id}`);
}));

module.exports = Router;