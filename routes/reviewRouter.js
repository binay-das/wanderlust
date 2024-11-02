const express = require('express');
const Router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError.js');
const { reviewSchema } = require('../schema');
const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { validateReview } = require('../middleware.js');

// review (POST)
Router.post("/", validateReview, wrapAsync(async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        console.log("new review saved");
        req.flash('success', 'new review created')
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

    req.flash('success', 'review deleted')
    res.redirect(`/listings/${id}`);
}));

module.exports = Router;