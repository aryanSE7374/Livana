const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner, validateListing} = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })


// const mongoose = require("mongoose"); // wiil be adding this module for the check Listing_ID feature, future commits
// ------------------------------------------------------------------------------------------- //

// to validate the listing schema while posting a listing into the DB using npm-joi

// validateListing method shifeted to ../middleware.js


// ------------------------------------------------------------------------------------------- //

// using router.route() method to get more cleaner code

// index route
// create route
router.route("/")
.get( wrapAsync(ListingController.index))
// .post(isLoggedIn , validateListing, wrapAsync (ListingController.createLisitng));
.post(upload.single('listing[image]'),(req,res)=>{
    console.log("req.body : ",req.body);
    console.log("req.file : ",req.file);
    res.send(req.file);
});

// new route
router.route("/new")
.get( isLoggedIn , ListingController.renderNewForm);

// Show Route
// update route
// delete route
router.route("/:id")
.get(wrapAsync(ListingController.showListing))
.put( isLoggedIn , isOwner , validateListing, wrapAsync(ListingController.updateListing))
.delete( isLoggedIn , isOwner , wrapAsync(ListingController.destroyListing));

// edit route
router.route("/:id/edit" )
.get( isLoggedIn , isOwner ,  wrapAsync(ListingController.renderEditForm));


// ------------------------------------------------------------------------------------------- //


// Index route : to get all Listings
// GET/listings

// router.get("/" , wrapAsync(ListingController.index));


// ------------------------------------------------------------------------------------------- //

// New and Create Route

// 1. GET/listings/new -> returns a form
// 2. On Submitting the from -> POST/listings

// New Route
// router.get("/new" , isLoggedIn , ListingController.renderNewForm);  

// Create Route
 
// router.post("/" , isLoggedIn , validateListing, wrapAsync (ListingController.createLisitng));


// ------------------------------------------------------------------------------------------- //

// Show Route : to view specific listings data 
// GET/listings/:id

// router.get("/:id", wrapAsync(ListingController.showListing));

// ------------------------------------------------------------------------------------------- //


// Update : Edit and Update Route

// 1. Edit Route -> GET/listings/:id/edit => returns edit form
// router.get("/:id/edit" , isLoggedIn , isOwner ,  wrapAsync(ListingController.renderEditForm));

// 2. Update route -> On submitting the form => PUT/listings/:id
// router.put("/:id" , isLoggedIn , isOwner , validateListing, wrapAsync(ListingController.updateListing));

// ------------------------------------------------------------------------------------------- //


// Delete Route 
// DELETE/listings/:id

// router.delete("/:id" , isLoggedIn , isOwner , wrapAsync(ListingController.destroyListing)); 


// ------------------------------------------------------------------------------------------- //


module.exports = router;