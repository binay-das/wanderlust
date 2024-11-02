const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError");
const { listingSchema } = require('./schema');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;              // saving the redirect url

        req.flash('error', 'You must be logged in to create a listing');
        return res.redirect("/login");
    }

    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash('error', 'you are not authorized to edit this listing');
        res.redirect(`/listings/${id}`);
        return;
    }

    next();
}

// Middleware: Validate Listing
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(400, errorMessage);

    } else {
        next();
    }
}