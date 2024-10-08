const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
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
app.get("/", (req, res)=>{
    res.send(`Hi, I'm root`);
});

app.get("/listings", async (req, res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
        
    
});
app.post("/listings", async(req, res)=>{
    let {title, description, image, price, country, location} = req.body;
    const newListing = new Listing({
        title: title,
        description: description,
        image: image, 
        price: price,
        country: country,
        location: location
    });

    await newListing.save();
    res.redirect("/listings");
});



app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
});

app.get("/listings/:id", async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
});
app.get("/listings/:id/edit", async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
});

app.put("/listings/:id", async(req, res)=>{
    let {id} = req.params;
    let {title, description, image, price, country, location} = req.body;
    const editListing = {
        title: title,
        description: description,
        image: image, 
        price: price,
        country: country,
        location: location
    };
    await Listing.findByIdAndUpdate(id, editListing, {new: true});
    res.redirect("/listings");
});



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

const port = 8080;
app.listen(port, ()=>{
    console.log(`Server is listening to ${port}`);
});