const Listing = require("../models/listing");
const listingSchema = require('../schema');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let fileName = req.file.filename;

    // const result = listingSchema.validate(req.body);
    // console.log(result);

    // if (result.error) {
    //     throw new ExpressError(400, result.error);
    // }

    if (!req.body.listing) {
        throw new ExpressError(400, 'Send valid data for a new listing');
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    await newListing.save();
    req.flash('success', 'new listing created')
    res.redirect("/listings");
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: 'reviews', populate: {path: 'author'}}).populate('owner');
    if (!listing) {
        req.flash('error', 'listing you requested not found');
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}

module.exports.showEditListingForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    // if (!listing) throw new ExpressError(404, "Listing Not Found");
    if (!listing) {
        req.flash('error', 'listing you requested not found');
        res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;

    const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing}, { new: true });
    
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