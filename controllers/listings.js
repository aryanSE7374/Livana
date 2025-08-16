const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken : mapToken});

module.exports.index = async (req , res)=>{
    console.log("get request recieved!");
    const allListings = await Listing.find({});
    console.log("------------------------------------------------------------------------");
    res.render("listings/index.ejs" , {allListings});
};

module.exports.renderNewForm = (req,res)=>{
  console.log("request for new form recieved!");

  // console.log("user details : " , req.user);
  console.log("------------------------------------------------------------------------");
  // below part is shifted to isLoggedIn middleware
  // if(!req.isAuthenticated()){
  //   console.log("authentication failed!");
  //   console.log("------------------------------------------------------------------------");
  //   req.flash("error" , "You must be logged-in to create Listing");
  //   return res.redirect("/login");
  // }
  res.render("listings/new.ejs");
};

module.exports.createLisitng = async (req , res, next )=>{

    let response  = await geocodingClient
      .forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
      .send();
    
    let url = req.file.path;
    let filename = req.file.filename;

    console.log("post request recieved");
    console.log("req.body: -- ",req.body , "Image :- url:" , url, "\nfilename:" , filename);

    const newListing = new Listing(req.body.listing);

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


    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    newListing.geometry = response.body.features[0].geometry;
    console.log(`new listing object created : ${newListing}`);
    await newListing.save();
    req.flash("success" , "New Listing Created!");
    console.log("newListing saved successfully! redirecting to the listings home page...");
    console.log("------------------------------------------------------------------------");
    res.redirect("/listings");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    console.log(`request recieved to show the details of id : ${id}`);
    // Check if ID is a valid ObjectId
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   // Return a custom 404 page or error response
    //   return res.status(404).render("error.ejs", { message: 'Invalid Listing ID' });
    // }

    // nested populate : populate all auhtor for all reviews for all listings
    const listing = await Listing.findById(id)
    .populate({path : "reviews",
      populate :{
        path : "author",
      },
    })
    .populate("owner");
    
    if(!listing){
      console.log("Listing user requested for does not exist!");
      req.flash("error" , "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    console.log("listing object : ",listing);
    
    console.log("------------------------------------------------------------------------");
    res.render("listings/show.ejs" , {listing});
  };


module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    console.log(`edit request recieved to get the form to edit details of id : ${id}`);
    // Check if ID is a valid ObjectId
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //   // Return a custom 404 page or error response
    //   return res.status(404).render("error.ejs", { message: 'Invalid Listing ID' });
    // }
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error" , "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl  = originalImageUrl.replace("/upload" , "/upload/w_250");

    console.log("------------------------------------------------------------------------");
    res.render("listings/edit.ejs" , {listing , originalImageUrl});
  };

module.exports.updateListing = async (req , res)=>{
    let {id} = req.params;
    console.log(`put request recieved for the id : ${id}`);
    // need more explaination...how deconstructed and req.body from where??
    let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});

    // if(req.file){} // alternative
    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = {url , filename};
      await listing.save();
    }
    
    console.log("------------------------------------------------------------------------");
    req.flash("success" , "Listing Updated!");
    // res.redirect("/listings");
    res.redirect(`/listings/${id}`);

  };

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    console.log(`delete request recieved for the id : ${id}`);
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("deleted listing : ");
    console.log(deletedListing);
    req.flash("success" , "Listing Deleted!");
    console.log("redirecting to the listings home page...");
    console.log("------------------------------------------------------------------------");
    res.redirect("/listings");
    };