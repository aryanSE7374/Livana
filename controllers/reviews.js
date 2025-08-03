const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req , res)=>{
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
  
};


module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  console.log(`delete request received for the id: ${id}, reviewId: ${reviewId}`);

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success" , "Review Deleted!");

  res.redirect(`/listings/${id}`);
};
