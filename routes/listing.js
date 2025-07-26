const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

// ------------------------------------------------------------------------------------------- //

// to validate the listing schema while posting a listing into the DB using npm-joi

const validateListing = (req , res , next)=>{
  console.log("validateListing is being called!");
  let {error} = listingSchema.validate(req.body);
  console.dir(error);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    console.log("errMsg = ",errMsg);
    throw new ExpressError(400 , errMsg);
  }else{
    next();
  }
}


// ------------------------------------------------------------------------------------------- //


// Index route : to get all Listings
// GET/listings

router.get("/" , wrapAsync(
  async (req , res)=>{
    console.log("get request recieved!");
    const allListings = await Listing.find({});
    console.log("------------------------------------------------------------------------");
    res.render("listings/index.ejs" , {allListings});
}));


// ------------------------------------------------------------------------------------------- //

// New and Create Route
// 1. GET/listings/new -> returns a form
// 2. On Submitting the from -> POST/listings

// New Route
router.get("/new" , (req,res)=>{
  console.log("request for new form recieved!");
  console.log("------------------------------------------------------------------------");
  res.render("listings/new.ejs");
});

// Create Route

router.post("/" , validateListing, wrapAsync (async (req , res, next )=>{
    // let {title , description , image, price , country , location} = req.body;
    // let listing = req.body.listing;
    console.log("post request recieved");
    console.log("req.body: -- ",req.body);

    const newListing = new Listing(req.body.listing);
    console.log(`new listing object created : ${newListing}`);

    // -----------------------------method 1---------------------------------- //
    /*
    if (!newListing.title) {
        // If title is missing, throw an ExpressError with status 400
        throw new ExpressError(400, "Title is missing!");
    }

    // Validate if description is missing
    if (!newListing.description) {
        // If description is missing, throw an ExpressError with status 400
        throw new ExpressError(400, "Description is missing!");
    }

    // Validate if location is missing
    if (!newListing.location) {
        // If location is missing, throw an ExpressError with status 400
        throw new ExpressError(400, "Location is missing!");
    }
    */
    // ------------------------------------------------------------------------------------------- //


    // -----------------------------method 2---------------------------------- //
    // using validateListing middleware within the post argument as a callback before wrapAsync

    // ------------------------------------------------------------------------------------------- //



    // console.log(newListing);
    await newListing.save();
    console.log("newListing saved successfully! redirecting to the listings home page...");
    console.log("------------------------------------------------------------------------");
    res.redirect("/listings");
}));


// ------------------------------------------------------------------------------------------- //

// Show Route : to view specific listings data 
// GET/listings/:id

router.get("/:id", wrapAsync(
  async (req,res)=>{
    let {id} = req.params;
    console.log(`request recieved to show the details of id : ${id}`);
    const listing = await Listing.findById(id).populate("reviews");
    console.log("------------------------------------------------------------------------");
    res.render("listings/show.ejs" , {listing});
  }
));

// ------------------------------------------------------------------------------------------- //


// Update : Edit and Update Route

// 1. Edit Route -> GET/listings/:id/edit => returns edit form
router.get("/:id/edit" , wrapAsync(
  async (req,res)=>{
    let {id} = req.params;
    console.log(`edit request recieved to get the form to edit details of id : ${id}`);
    const listing = await Listing.findById(id);
    console.log("------------------------------------------------------------------------");
    res.render("listings/edit.ejs" , {listing});
  }
));

// 2. Update route -> On submitting the form => PUT/listings/:id
router.put("/:id" , validateListing, wrapAsync(
  async (req , res)=>{
    let {id} = req.params;
    console.log(`put request recieved for the id : ${id}`);
    // need more explaination...how deconstructed and req.body from where??
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    console.log("------------------------------------------------------------------------");
    // res.redirect("/listings");
    res.redirect(`/listings/${id}`);

  }
));

// ------------------------------------------------------------------------------------------- //


// Delete Route 
// DELETE/listings/:id

router.delete("/:id" , wrapAsync(
  async (req,res)=>{
    let {id} = req.params;
    console.log(`delete request recieved for the id : ${id}`);
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("deleted listing : ");
    console.log(deletedListing);
    console.log("redirecting to the listings home page...");
    console.log("------------------------------------------------------------------------");
    res.redirect("/listings");
    }
)); 


// ------------------------------------------------------------------------------------------- //


module.exports = router;