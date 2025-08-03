const express = require("express");
const router = express.Router( {mergeParams : true} );
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const {reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");

// ------------------------------------------------------------------------------------------- //

// to validate the review schema while posting a review into the DB using npm-joi

// validateReview function shifeted to ../middleware.js


// ------------------------------------------------------------------------------------------- //

// REVIEWS 

// Reviews : get form within the show route (updated in show.ejs)
// POST route to post the review

router.post("/" , isLoggedIn , validateReview , wrapAsync(ReviewController.createReview));


// ------------------------------------------------------------------------------------------- //

// Reviews : DElETE review route

router.delete("/:reviewId", isReviewAuthor , wrapAsync(ReviewController.destroyReview));


// ------------------------------------------------------------------------------------------- //

module.exports = router;