const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/livana";

main()
 .then(() => {
    console.log('Successfully Connected Mongoose');
 })
 .catch((err) => {
    console.log(err);
 })

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    // 1. Clear everything
    await Listing.deleteMany({});
    await Review.deleteMany({});
    console.log("Cleared existing listings and reviews.");

    // 2. Find or create user "demouser"
    let demoUser = await User.findOne({ username: 'demouser' });
    if (!demoUser) {
        const newUser = new User({ email: 'demo@example.com', username: 'demouser' });
        demoUser = await User.register(newUser, 'password123'); // Register with some password
        console.log("Created new demouser");
    } else {
        console.log("Found existing demouser");
    }

    // 3. Prepare listings with the demouser owner
    const mappedListings = initData.data.map((obj) => ({
        ...obj,
        owner: demoUser._id,
    }));

    // 4. Insert listings
    const insertedListings = await Listing.insertMany(mappedListings);
    console.log("Inserted listings with new owner.");

    // 5. Add 1-2 reviews to each listing
    for (let listing of insertedListings) {
        const review1 = new Review({
            comment: "Great place to stay! Highly recommend.",
            rating: 5,
            author: demoUser._id
        });
        const review2 = new Review({
            comment: "Nice location, but could be cleaner.",
            rating: 4,
            author: demoUser._id
        });

        await review1.save();
        await review2.save();

        listing.reviews.push(review1._id);
        listing.reviews.push(review2._id);
        
        await listing.save();
    }

    console.log("Data was initialized successfully with reviews and owner!");
    mongoose.connection.close();
}

initDB();