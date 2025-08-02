const express = require("express");
const router = express.Router( {mergeParams : true} );
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");


// ------------------------------------------------------------------------------------------- //

// to validate the review schema while posting a review into the DB using npm-joi

// validateReview function shifeted to ../middleware.js


// ------------------------------------------------------------------------------------------- //

// REVIEWS 

// Reviews : get form within the show route (updated in show.ejs)
// POST route to post the review

router.post("/" , isLoggedIn , validateReview , wrapAsync( async(req , res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  // console.log(req.body);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);
  console.log("Created Review : " , newReview);

  await newReview.save();
  await listing.save();

  console.log("new review saved! redirecting to show route....");
  console.log("------------------------------------------------------------------------");
  req.flash("success" , "New review Created!");
  // redirect to show route
  res.redirect(`/listings/${listing._id}`);
  
}));


// ------------------------------------------------------------------------------------------- //

// Reviews : DElETE review route

router.delete("/:reviewId", isReviewAuthor , wrapAsync(async (req, res) => {
  let { id, reviewId } = req.params;
  console.log(`delete request received for the id: ${id}, reviewId: ${reviewId}`);

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success" , "Review Deleted!");

  res.redirect(`/listings/${id}`);
}));


// ------------------------------------------------------------------------------------------- //

module.exports = router;