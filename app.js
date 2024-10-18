const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const Review = require('./models/review.js');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(() => {
        console.log(`Connected to DB`);
    })
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(MONGO_URL);
}
app.get("/", (req, res) => {
    res.send(`Hi, I'm root`);
});

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(400, errorMessage);

    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errorMessage = error.details.map((el) => el.message).join(', ');
        throw new ExpressError(400, errorMessage);

    } else {
        next();
    }
}

app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });


}));

app.post("/listings", validateListing, wrapAsync(async (req, res, next) => {

    const result = listingSchema.validate(req.body);
    console.log(result);

    if (result.error) {
        throw new ExpressError(400, result.error);
    }
    let { title, description, image, price, country, location } = req.body;
    const newListing = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        country: country,
        location: location
    });

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



app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    res.render("listings/show.ejs", { listing });
}));

app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

app.put("/listings/:id", validateListing, wrapAsync(async (req, res) => {
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
    await Listing.findByIdAndUpdate(id, editListing, { new: true });
    res.redirect("/listings");
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");

}));


// review (POST)
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${listing._id}`);
}));

// review (DELETE)
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});  // the review is removed from the listing
    // '$pull' operator removes form an exising array of all instances of a value that match a specified condition

    await Review.findByIdAndDelete(reviewId); // the review is deleted as well

    res.redirect(`/listings/${id}`);
}));



// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new villa",
//         description: "By the beach",

//         price: 1200,
//         location: "Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log(`Sample saved`);

// })

app.all('*', (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.status(statusCode).render("error.ejs", { err });
    // res.status(statusCode).send({ message });
});

const port = 8080;
app.listen(port, () => {
    console.log(`Server is listening to ${port}`);
});