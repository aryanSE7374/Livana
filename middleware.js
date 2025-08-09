const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req , res , next) => {
    if(!req.isAuthenticated()){
        // redirect url save
        req.session.redirectUrl = req.originalUrl;
        console.log("authentication failed!");
        console.log("------------------------------------------------------------------------");
        req.flash("error" , "You must be logged-in to create Listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next)=>{
    console.log("isOwner middleware is being called");
    let {id} = req.params;
    console.log(`put request recieved for the id : ${id}`);
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      console.log("owner is not authorized to edit this listing, redirecting to show lisitng page...");
      console.log("------------------------------------------------------------------------");
      req.flash("error" , "You don't own this listing!");
    //   req.flash("error" , "You don't have permission to edit or delete this listing!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req , res , next)=>{
  console.log("validateListing is being called!");
  let {error} = listingSchema.validate(req.body);
  console.dir("error : ",error);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    console.log("errMsg = ",errMsg);
    throw new ExpressError(400 , errMsg);
  }else{
    next();
  }
}

module.exports.validateReview = (req , res , next)=>{
  console.log("validateReview is being called!");
  let {error} = reviewSchema.validate(req.body);
  console.dir(error);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    console.log("errMsg = ",errMsg);
    throw new ExpressError(400 , errMsg);
  }else{
    next();
  }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    console.log("isOwner middleware is being called");
    let {id ,reviewId} = req.params;
    console.log(`put request recieved for the id : ${id}`);
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
      console.log("owner is not authorized to edit this listing, redirecting to show lisitng page...");
      console.log("------------------------------------------------------------------------");
      req.flash("error" , "You are not the author of this review!");
    //   req.flash("error" , "You don't have permission to edit or delete this listing!");
      return res.redirect(`/listings/${id}`);
    }
    next();
}
