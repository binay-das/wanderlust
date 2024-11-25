const Listing = require("../models/listing");
const listingSchema = require('../schema');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.createListing = async (req, res, next) => {
    try {
        // Debugging logs
        console.log("req.body:", req.body);
        console.log("req.file:", req.file);

        // Validate if req.body.listing exists
        if (!req.body.listing) {
            throw new ExpressError(400, 'Send valid data for a new listing');
        }

        // Extract image details
        const { path: url, filename } = req.file || {};

        // Create the new listing
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        if (url && filename) {
            newListing.image = { url, filename };
        }

        // Save the listing
        await newListing.save();

        req.flash('success', 'New listing created');
        res.redirect("/listings");
    } catch (err) {
        console.error("Error in createListing:", err);
        next(err); // Pass the error to the error handler middleware
    }
};


module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
    if (!listing) {
        req.flash('error', 'listing you requested not found');
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.showEditListingForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'listing you requested not found');
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    console.log("Editing Listing ID:", id);
    console.log("Request Body:", req.body);
    console.log("Request Body:", req.body.listing);
    console.log("Uploaded File:", req.file);

    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if (typeof req.file != "undefined") {         // check if file is updated         
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }

    req.flash('success', 'listing updated');
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success', 'listing deleted');
    res.redirect("/listings");

}