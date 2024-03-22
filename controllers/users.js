const User= require("../models/user");

//render SignUpForm
module.exports.renderSignUpForm=(req, res) => {
    res.render("./users/signup.ejs");
  }
  //SignUpForm
module.exports.singnup=async (req, res) => {
    try {
      let { username, password, email } = req.body;
      const newUser = new User({ email, username });
      const registereduser = await User.register(newUser, password);
      console.log(registereduser);
      req.login(registereduser, (err) => {
        if (err) {
          return next(err);
        }
         req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  };
  //render LogInForm
  module.exports.renderLoginForm= (req, res) => {
    res.render("./users/login.ejs");
  }
  //LogIn
  module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    // res.redirect("/listings");
    let redirectUrl =res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };

  module.exports.logout= (req, res, next) => {
    req.logOut((err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "You are logged out");
      res.redirect("/listings");
    });
  }