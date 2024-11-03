const express = require('express');
const Router = express.Router();
const wrapAsync = require('../utils/wrapAsync');

const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const { index, renderNewForm, showListing, editListing, showEditListingForm, destroyListing, createListing } = require('../controllers/listings.js');

Router.get("/", wrapAsync(index));

Router.post("/", isLoggedIn, validateListing, wrapAsync(createListing));

Router.get("/new", isLoggedIn, renderNewForm);

Router.get("/:id", wrapAsync(showListing));

Router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(showEditListingForm));

Router.put("/:id", isLoggedIn, isOwner, wrapAsync(editListing));

Router.delete("/:id", isLoggedIn, isOwner, wrapAsync(destroyListing));

module.exports = Router;