const express = require("express");
const router = express.Router( {mergeParams : true} );
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


// ------------------------------------------------------------------------------------------- //

// to validate the review schema while posting a review into the DB using npm-joi

const validateReview = (req , res , next)=>{
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


// ------------------------------------------------------------------------------------------- //

// REVIEWS 

// Reviews : get form within the show route (updated in show.ejs)
// POST route to post the review

router.post("/" , validateReview , wrapAsync( async(req , res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  console.log(req.body);
  

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  console.log("new review saved! redirecting to show route....");
  console.log("------------------------------------------------------------------------");
  // redirect to show route
  res.redirect(`/listings/${listing._id}`);
  
}));


// ------------------------------------------------------------------------------------------- //

// Reviews : DElETE review route

router.delete("/:reviewId", wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  console.log(`delete request received for the id: ${id}, reviewId: ${reviewId}`);

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
}));


// ------------------------------------------------------------------------------------------- //

module.exports = router;