const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index Route
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("./listings/index.ejs", { allListings });
};
//New Route
module.exports.renderNewForm = (req, res) => {
  // console.log(req.user);
  // if(!req.isAuthenticated()){   // Instead of using this we place it in a middleware.js show that we can use this everywhere
  //   req.flash("error","You must be logged in to create listing!");
  //   res.redirect("/login")
  // }
  res.render("./listings/new.ejs");
};
//Show Route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  console.log(listing);
  res.render("./listings/show.ejs", { listing });
};
//Create Route
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  // if (!req.body.listing) {
  //   throw new ExpressError(400,"Send valid data for listing")
  // }

  // let result= listingSchema.validate(req.body);  to validate the schema through Joi
  // console.log(result);
  // if(result.error){
  //   throw new ExpressError(400,result.error)
  // }
  //    let {title,description, price,location,country,image,}= req.body;
  // let listing = req.body.listing; //Another way to get value from request dot body in this method we fet value in form of object key and value pair form
  let url = req.file.path;
  let filename = req.file.filename;
  const newlisting = new Listing(req.body.listing); //in this way directly store in database model

  // if (!req.body.listing.title) {   //we can also validate in this way but its bulky in large data validation
  //   throw new ExpressError(400,"Title is missing")
  // }
  // if (!req.body.listing.description) {
  //   throw new ExpressError(400,"Description is missing")
  // }
  // if (!req.body.listing.location) {
  //   throw new ExpressError(400,"Location is missing")
  // }
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };
   newlisting.geometry= response.body.features[0].geometry;
   let savedListing = await newlisting.save();
   console.log(savedListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
  //   console.log(listing);
};
//Edit Form

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  let NeworiginalImageurl = originalImageUrl.replace(
    "/upload",
    "/upload/w_250"
  );
  res.render("./listings/edit.ejs", { listing, NeworiginalImageurl });
};
//Update Route
module.exports.updateListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Send valid data for listing");
  }
  let { id } = req.params;
  // let listing = await Listing.findById(id);  copy this code to middleware isOWner

  // if (!currUser && listing.owner._id.equals(res.locals.currUser._id)) {
  //   req.flash("error","You don't permission")
  //  return res.redirect(`/listings/${id}`);
  // }
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  //  res.redirect("/listings");
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};
//Delete Route
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  const deletedList = await Listing.findByIdAndDelete(id);
  console.log(deletedList);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
