var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");

// INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campsites: allCampgrounds, page: 'campgrounds'});
       }
    });
});

// CREATE - add new campground to databse
router.post("/", middleware.isLoggedIn, function(req, res){
    console.log("POST /campgrounds");
    var siteName = req.body.name;
    var sitePrice = req.body.price;
    var siteImage = req.body.image;
    var siteDescription = req.body.description;
    var author = {
        username: req.user.username,
        id: req.user._id
    }
    Campground.create(
        {
            name: siteName,
            price: sitePrice,
            image: siteImage,
            description: siteDescription,
            author: author
        }, function(err, campground){
            if(err) {
                req.flash("error", "Could not create new campground");
                res.redirect("/campgrounds");
                console.log(err);
            } else {
                if(!campground) {
                    req.flash("error", "Campground could not be created");
                    res.redirect("/campgrounds");
                }
                res.redirect("/campgrounds");
                console.log("POST /campgrounds");
                console.log(campground);
            }
        }
    )
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
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
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
    })
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
