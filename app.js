if (process.env.NODE_ENV !="production") {
  require('dotenv').config()
  // console.log(process.env.SECRET) 
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
// const Listing = require("./models/listing.js"); // This commented part is not need to use in this aap.js file because restructure the review and listing in different files.
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync= require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js");
const { error } = require("console");
// const {listingSchema,reviewSchema} = require("./schema.js")
// const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport =require("passport")
const LocalStrategy= require("passport-local")
const User = require("./models/user.js")

// Name variables like listings to listingsRouter
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter =require("./routes/user.js")

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl= process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB"); 
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dbUrl);
}

app.set("views engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store= MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});
store.on("error",()=>{
  console.log("ERROR In MONGO SESSION STORE", err);
})
const sessionOptions= {
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  },
}

// app.get("/", (req, res) => {
//   res.send("Hello i am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success= req.flash("success");
  res.locals.error= req.flash("error");
  res.locals.currUser= req.user;
  next();
});

// app.get("/demouser",async (req,res)=>{
//   let fakeUser= new User({
//     email:"students@gmail.com",
//     username:"WebDev-stud",
//   })
//  let registeredUser= await User.register(fakeUser,"helloworld");
//  res.send(registeredUser);
// })

// const validateListing=(req,res,next)=>{
//   let {error}=listingSchema.validate(req.body);
//   if(error){
//     let errmsg = error.details.map((el)=> el.message).join(",");
//  throw new ExpressError(400,errmsg)
//   }
//   else{
//     next();
//   }
// }

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// app.get("/testListing", async (req,res)=>{
// let sampleListing =new  Listing({
//     title:"My new Villa",
//     description:"by the beach",
//     price:1200,
//     location: "Varanasi Uttar Pradesh",
//     country:"India",
// });
// await sampleListing.save();
// console.log("Sample was saved");
// res.send("Successful testing");
// });

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.render("./listings/error.ejs", { message });
  // res.status(statusCode).send(message)

  // res.send("Something Went wrong")
});
app.listen(8080, () => {
  console.log("Server is listing to port 8080");
});
