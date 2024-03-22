const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
// const {listingSchema} = require("../schema.js")  //Shift this Validate listing to as a in middleware .
// const ExpressError= require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const review = require("../models/review.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const {
  index,
  renderNewForm,
  showListing,
  createListing,
  renderEditForm,
  updateListing,
  deleteListing,
} = require("../controllers/listing.js");

// const validateListing=(req,res,next)=>{    //Shift this Validate listing to as a in middleware function.
//   let {error}=listingSchema.validate(req.body);
//   if(error){
//     let errmsg = error.details.map((el)=> el.message).join(",");
//  throw new ExpressError(400,errmsg)
//   }
//   else{
//     next();
//   }
// };

//Index Route
//Create Route
router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(createListing)
  );

// .post(upload.single('listing[image]'),(req,res)=>{
//   res.send(req.file)
// })

// New Route
router.get("/new", isLoggedIn, renderNewForm);

//Show Route
//Update Route
//delete Route
router
  .route("/:id")
  .get(wrapAsync(showListing))
  .put(isLoggedIn, isOwner,upload.single("listing[image]"), validateListing, wrapAsync(updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

module.exports = router;
