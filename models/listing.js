const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title: {
        type: String,
        require: true,
    },
    description: String,
    image: {
        type: String,
        // default parameter is used for backend (db)
        default : "https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg",
        // set is used for client side defualt link
        set : (v) => 
            v === "" 
                ? "https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg" 
                : v,
        // filename: String,
    },
    price: Number,
    location: String,
    country: String,
})

const Listing = mongoose.model("Listing" , listingSchema);

module.exports = Listing;