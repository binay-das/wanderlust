const Listing = require("../models/listing");
const Review = require("../models/review");

const createReview = async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);
        let newReview = new Review(req.body.review);
        newReview.author = req.user._id;

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
}

const destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });  // the review is removed from the listing
    // '$pull' operator removes form an exising array of all instances of a value that match a specified condition

    await Review.findByIdAndDelete(reviewId); // the review is deleted as well

    req.flash('success', 'review deleted')
    res.redirect(`/listings/${id}`);
}

module.exports = {
    createReview,
    destroyReview
}