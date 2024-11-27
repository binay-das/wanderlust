const mongoose = require('mongoose');
const initData = require('./data1.js');
const Listing = require("../models/listing.js");
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
main()
    .then(() => {
        console.log(`Connected to DB`);
    })
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(process.env.MONGO_URI);
}

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((ob) => ({...ob, owner: "674483580cfb14910d0e1cfa"}));
    await Listing.insertMany(initData.data);

    // console.log(initData);
    // console.log(initData.data);
    console.log(`Data was initialised`);
};

// initDB();

main()
    .then(initDB)
    .catch((err) => {
        console.log(err);
    });