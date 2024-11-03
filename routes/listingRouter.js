const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');

const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const { index, renderNewForm, showListing, editListing, showEditListingForm, destroyListing, createListing } = require('../controllers/listings.js');
const multer = require('multer');

router.route('/')
.get( wrapAsync(index))
.post( isLoggedIn, validateListing, wrapAsync(createListing))


router.get("/new", isLoggedIn, renderNewForm);


router.route('/:id')
.get(wrapAsync(showListing))
.put(isLoggedIn, isOwner, wrapAsync(editListing))
.delete(isLoggedIn, isOwner, wrapAsync(destroyListing))


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(showEditListingForm));


module.exports = router;