const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://images.pexels.com/photos/27596706/pexels-photo-27596706/free-photo-of-a-street-sign-is-on-the-side-of-a-building.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        set: (v) => v === "" ? "https://images.pexels.com/photos/27596706/pexels-photo-27596706/free-photo-of-a-street-sign-is-on-the-side-of-a-building.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;