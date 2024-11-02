const express = require('express');
const Router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing.js');

const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');

Router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });


}));

Router.post("/", isLoggedIn, validateListing, wrapAsync(async (req, res, next) => {

    // const result = listingSchema.validate(req.body);
    // console.log(result);

    // if (result.error) {
    //     throw new ExpressError(400, result.error);
    // }


    // let { title, description, image, price, country, location } = req.body;
    // const newListing = new Listing({
    //     title: title,
    //     description: description,
    //     image: image,
    //     price: price,
    //     country: country,
    //     location: location
    // });

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // if (!newListing.title) {
    //     throw new ExpressError(400, "Please provide a title");
    // }
    // if (!newListing.description) {
    //     throw new ExpressError(400, "Please provide a description");
    // }
    // if (!newListing.location) {
    //     throw new ExpressError(400, "Please provide a location");
    // }


    await newListing.save();
    req.flash('success', 'new listing created')
    res.redirect("/listings");


}));



Router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
});

Router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews').populate('owner');
    if (!listing) {
        req.flash('error', 'listing you requested not found');
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

Router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    // if (!listing) throw new ExpressError(404, "Listing Not Found");
    if (!listing) {
        req.flash('error', 'listing you requested not found');
        res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
}));

Router.put("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;

    let { title, description, image, price, country, location } = req.body;
    const editListing = {
        title: title,
        description: description,
        image: image,
        price: price,
        country: country,
        location: location
    };

    // const editListing = req.body.listing;
    const updatedListing = await Listing.findByIdAndUpdate(id, editListing, { new: true });
    req.flash('success', 'listing updated');
    res.redirect(`/listings/${updatedListing._id}`);
}));

Router.delete("/:id", isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash('success', 'listing deleted');
    res.redirect("/listings");

}));

module.exports = Router;