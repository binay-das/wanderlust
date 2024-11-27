const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');

const multer = require('multer');       // handling multipart / form data
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const { index, renderNewForm, showListing, editListing, showEditListingForm, destroyListing, createListing } = require('../controllers/listings.js');

router.route('/')
    .get(wrapAsync(index))
    .post(isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(createListing)
    )


router.get("/new", isLoggedIn, renderNewForm);


router.route('/:id')
    .get(wrapAsync(showListing))
    .put(isLoggedIn, 
        isOwner, 
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(editListing)
    )

    .delete(isLoggedIn, isOwner, wrapAsync(destroyListing))


router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(showEditListingForm));


module.exports = router;