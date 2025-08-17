const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

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
   await Listing.deleteMany({});
   // initData.data = initData.data.map((obj) => ({ ...obj, owner: '6888c393df151daa8a91b692', })); // new field added - owner
   await Listing.insertMany(initData.data)
   console.log("data was initialized ...");
}

initDB();