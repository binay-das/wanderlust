const Listing = require("./models/listing");
const Review = require('./models/review');
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require('./schema');

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be logged in to create a listing');
        return res.redirect("/login");
    }
    next();
}

const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

const isOwner = async (req, res, next) => {
    try {
        let { id } = req.params;
        let listing = await Listing.findById(id);
        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listings');
        }
        if (!listing.owner._id.equals(res.locals.currUser._id)) {
            req.flash('error', 'You are not authorized to edit this listing');
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err);
    }
}

const isReviewAuthor = async (req, res, next) => {
    try {
        let { id, reviewId } = req.params;
        let review = await Review.findById(reviewId);
        if (!review) {
            req.flash('error', 'Review not found');
            return res.redirect(`/listings/${id}`);
        }
        if (!review.author._id.equals(res.locals.currUser._id)) {
            req.flash('error', 'You are not authorized to delete this review');
            return res.redirect(`/listings/${id}`);
        }
        next();
    } catch (err) {
        next(err);
    }
}

// Middleware: Validate Listing
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(', ');
        return next(new ExpressError(400, errorMessage));
    }
    next();
}

// Middleware: Validate Review
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(', ');
        return next(new ExpressError(400, errorMessage));
    }
    next();
}

module.exports = {
    isLoggedIn,
    saveRedirectUrl,
    isOwner,
    isReviewAuthor,
    validateListing,
    validateReview,
}