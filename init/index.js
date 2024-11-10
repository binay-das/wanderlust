const mongoose = require('mongoose');
const initData = require('./data1.js');
const Listing = require("../models/listing.js");

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

const initDB = async() => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((ob) => ({...ob, owner: "672f5404a0b7dbebd681cdd1"}));
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