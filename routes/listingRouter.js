const express = require('express');
const Router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError.js');
const { listingSchema } = require('../schema');
const Listing = require('../models/listing.js');

// Middleware: Validate Listing
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(400, errorMessage);

    } else {
        next();
    }
}

Router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });


}));

Router.post("/", validateListing, wrapAsync(async (req, res, next) => {

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
    res.redirect("/listings");


}));



Router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

Router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    res.render("listings/show.ejs", { listing });
}));

Router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) throw new ExpressError(404, "Listing Not Found");

    res.render("listings/edit.ejs", { listing });
}));

Router.put("/:id", wrapAsync(async (req, res) => {
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
    res.redirect(`/listings/${updatedListing._id}`);
})); 

Router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");

}));

module.exports = Router;