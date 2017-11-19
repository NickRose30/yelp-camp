var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    User        = require("../models/user"),
    passport    = require("passport");

// landing page route
router.get("/", function(req, res){
   res.render("landing");
   console.log("GET /");
});

// show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

//show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

// register new user route
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(err, currUser) {
            if(err) {
                req.flash("error", "Could not authenticate user");
                console.log(err);
                return res.redirect("/login");
            }
            req.flash("success", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
        console.log("POST /register");
    });
});

// login user route
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "login"
}), function(req, res) {
    console.log("GET /login");
});

// logout use route
router.get("/logout", function(req, res) {
   req.logout();
   req.flash("success", "Successfully logged out");
   res.redirect("/campgrounds");
});

module.exports = router;