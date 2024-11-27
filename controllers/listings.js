const Listing = require("../models/listing");

const index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

const createListing = async (req, res, next) => {
    try {
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


const renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

const showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('owner');
    if (!listing) {
        req.flash('error', 'listing you requested not found');
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

const showEditListingForm = async (req, res) => {
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

const editListing = async (req, res) => {
    let { id } = req.params;

    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, {new: true});
    console.log("Listing: ", req.body.listing)
    console.log("Updated Listing:", updatedListing);

    if (typeof req.file !== "undefined") {         // check if file is updated         
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }

    req.flash('success', 'listing updated');
    res.redirect(`/listings/${id}`);
}

const destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success', 'listing deleted');
    res.redirect("/listings");

}

module.exports = {
    index,
    createListing,
    renderNewForm,
    showListing,
    showEditListingForm,
    editListing,
    destroyListing,
}