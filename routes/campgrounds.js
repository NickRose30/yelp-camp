var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware"),
    geocoder = require('geocoder');


//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index",{campsites: allCampgrounds});
        }
    });
});


//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    console.log("POST /campgrounds");
    var siteName = req.body.name;
    var sitePrice = req.body.price;
    var siteImage = req.body.image;
    var siteDescription = req.body.description;
    var author = {
        username: req.user.username,
        id: req.user._id
    }
    geocoder.geocode(req.body.location, function (err, data) {
        if(err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = {name: siteName, image: siteImage, description: siteDescription, price: sitePrice, author:author, location: location, lat: lat, lng: lng};
        // Create a new campground and save to DB
        Campground.create(newCampground, function(err, newlyCreated){
            if(err){
                console.log(err);
            } else {
                //redirect back to campgrounds page
                console.log(newlyCreated);
                res.redirect("/campgrounds");
            }
        });
    });
});

// NEW - show form for creating new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
    console.log("GET /campgrounds/new");
});

// SHOW - shows info about a campground
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            req.flash("error", "Could not find campground");
            res.redirect("/campgrounds");
            console.log(err);
        } else{
            if(!foundCampground) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            }
            res.render("campgrounds/show", {campground: foundCampground});
            console.log("GET /campgrounds/" + req.params.id);
        }
    });
});

// EDIT - edit a campground page
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            req.flash("error", "Could not find campground");
            res.redirect("campgrounds/" + req.params.id);
            console.log(err);
        } else {
            if(!foundCampground) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            }
            res.render("campgrounds/edit", {campground: foundCampground});
            console.log("GET /campgrounds/" + req.params.id + "/edit");
        }
    });
});

// UPDATE - put request to update a campground
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        if(err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }
        var newCampground = req.body.campground;
        newCampground.lat = data.results[0].geometry.location.lat;
        newCampground.lng = data.results[0].geometry.location.lng;
        newCampground.location = data.results[0].formatted_address;
        Campground.findByIdAndUpdate(req.params.id, newCampground, function(err, updatedCampground) {
        if(err) {
            req.flash("error", "Could not update campground");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            if(!updatedCampground) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            }
            res.redirect("/campgrounds/" + req.params.id);
            console.log("PUT /campgrounds/" + req.params.id);
        }
    });
    });
});

// DESTROY - delete a campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, campground) {
        if(err) {
            req.flash("error", "Could not remove campground");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            if(!campground) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            }
            res.redirect("/campgrounds");
            console.log("DELETE /campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;
