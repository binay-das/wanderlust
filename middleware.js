const Listing = require("./models/listing");
const Review = require('./models/review');
const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require('./schema');

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;              // saving the redirect url

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
    let { id } = req.params;

    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash('error', 'you are not authorized to edit this listing');
        res.redirect(`/listings/${id}`);
        return;
    }

    next();
}

const isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) {
        req.flash('error', 'you are not authorized to delete this review');
        res.redirect(`/listings/${id}`);
        return;
    }

    next();
}

// Middleware: Validate Listing
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        console.log("Validation error: ", error);
        let errorMessage = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(400, errorMessage);

    } else {
        next();
    }
}

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



module.exports = {
    isLoggedIn,
    saveRedirectUrl,
    isOwner,
    isReviewAuthor,
    validateListing,
    validateReview,
}