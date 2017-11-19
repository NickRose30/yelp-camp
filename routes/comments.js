var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");

// NEW - show form to add new comment
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            req.flash("error", "Could not find campground");
            res.redirect("/campgrounds");
            console.log(err);
        } else {
            if(!campground) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            }
            res.render("comments/new", {campground: campground});
            console.log("GET /campgrounds/" + req.params.id + "/comments/new");
        }
    });
});

// CREATE - add new comment to database
router.post("/", middleware.isLoggedIn,  function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            req.flash("error", "Could not find campground");
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            if(!campground) {
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            }
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    req.flash("error", "Could not add comment");
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    if(!comment) {
                        req.flash("error", "Comment not created");
                        res.redirect("/campgrounds");
                    }
                    comment.author = {
                        username: req.user.username,
                        id: req.user._id
                    };
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                    console.log("POST /campgrounds/" + campground._id);
                }
            });
        }
    });
});

// EDIT - edit a comment
router.get("/:comment_id/edit", function(req, res) {
    Comment.findById(req.params.comment_id, function(err, comment) {
        if(err) {
            req.flash("error", "Could not find comment");
            console.log(err);
            res.redirect("back");
        } else {
            if(!comment) {
                req.flash("error", "Comment not found");
                res.redirect("/campgrounds");
            }
            res.render("comments/edit", {campground_id: req.params.id, comment: comment});
            console.log("GET /campgrounds/" + req.params.id + "/comments/" + req.params.comment_id + "/edit");
        }
    });
});

// UPDATE - update a campground
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
        if(err) {
            req.flash("error", "Could not find comment");
            console.log(err);
            res.redirect("/campgrounds/" + req.params.id);
        } else {
            if(!comment) {
                req.flash("error", "Comment not found");
                res.redirect("/campgrounds");
            }
            res.redirect("/campgrounds/" + req.params.id);
            console.log("PUT /campgrounds/" + req.params.id + "/comments/" + req.params.comment_id + "/edit");
        }
    });
});

// DESTROY - delete a comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, comment) {
        if(err) {
            req.flash("error", "Could not find comment");
            console.log(err);
            res.redirect("back");
        } else {
            if(!comment) {
                req.flash("error", "Comment not found");
                res.redirect("/campgrounds");
            }
            req.flash("success", "Successfully deleted comment");
            res.redirect("/campgrounds/" + req.params.id);
            console.log("DELETE /campgrounds/" + req.params.id + "/comments/" + req.params.comment_id);
        }
    });
});

module.exports = router;