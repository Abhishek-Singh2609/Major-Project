const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const {reviewSchema} = require("../schema.js")  //Shift this Validate review object to as a in middleware function.
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const { createReview, destroyReview } = require("../controllers/reviews.js");

//for review object validation
// const validateReview =(req,res,next)=>{           //Shift this Validate review object to as a in middleware function.
//     let {error}= reviewSchema.validate(req.body);
//     if(error){
//       let errmsg = error.details.map((el)=> el.message).join(",");
//    throw new ExpressError(400,errmsg)
//     }
//     else{
//       next();
//     }
//   };

// Reviews
//post Review route
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(createReview)
);

//Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(destroyReview)
);
module.exports = router;

// router.post("/listings/:id/reviews", validateReview ,wrapAsync (async(req,res) =>{
//     let listing = await Listing.findById(req.params.id);

//     let newReview= new Review(req.body.review);
//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();
//     res.redirect(`/listings/${listing._id}`);
//     // console.log("new review saved");
//     // res.send("New Review Saved")
//     }));

//     //Delete Review Route
//     router.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//       let{id,reviewId}=req.params;
//       await Listing.findByIdAndUpdate(_id,{$pull:{reviews: reviewId}})
//       await Review.findByIdAndDelete(reviewId);
//       res.redirect(`/listings/${id}`)
//     }));
//     module.exports=router;
