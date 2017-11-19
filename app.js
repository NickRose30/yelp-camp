var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    localStrategy       = require("passport-local"),
    methodOverride      = require("method-override"),
    flash               = require("connect-flash"),
    Campground          = require("./models/campground"),
    Comment             = require("./models/comment"),
    User                = require("./models/user"),
    seedDB              = require("./seeds.js"),
    commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");

// CONNECT TO MONGO
// connent to mongo database
mongoose.connect(process.env.DATABASEURL, {useMongoClient: true});
mongoose.Promise = global.Promise;

// MISC. APP CONFIGURATION
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PUT DUMMY DATA INTO DATABASE
// seedDB();

// PASSPORT CONFIGURATIONN - FOR AUTHENTICATION
app.locals.moment = require('moment');
app.use(require("express-session")({
    secret: "this is the secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// MIDDLEWARE TO BE CALLED ON EVERY ROUTE
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// USE THE ROUTES FROM THE EXTERNAL ROUTES FILES
// THE FIRST ARGUMENT IS WHAT WILL BE ADDED BEFORE ALL ROUTES IN THE EXTERNAL ROUTES FILES
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use(indexRoutes);

// START SERVER
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("YelpCamp Server Started and Listening on Port " + process.env.PORT);
});