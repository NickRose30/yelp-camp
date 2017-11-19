var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment");


var sites = [
    {
        name : "June Lake", 
        image : "https://www.campsitephotos.com/photo/camp/18652/June_Lake_Boat_Ramp.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name : "Devils Canyon", 
        image : "https://www.campsitephotos.com/photo/camp/15515/Devils_Canyon_View_1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        name : "Quail Creek State Park", 
        image : "https://www.campsitephotos.com/photo/camp/16351/Quail_Creek_State_Park_004.jpg",
        description: ""
    },
    {
        name : "Buffalo Plains Campground", 
        image : "https://www.yellowstonenationalparklodges.com/content/uploads/2017/04/madison-campground-1024x768.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
]

function seedDB(){
    Comment.remove({}, function(err, data) {
        if(err) {
            console.log(err);
        } else {
            console.log("Comments removed");
            Campground.remove({}, function(err, data) {
                if(err) {
                    console.log(err);
                } else {
                    console.log("Campgrounds removed");
                    sites.forEach(function(seed) {
                        Campground.create(seed, function(err, campground) {
                            if(err) {
                                console.log(err);
                            } else {
                                console.log("Added new campground");
                                Comment.create(
                                    {
                                        text: "this is a comment",
                                        author: "me"
                                    }, function(err, comment){
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            campground.comments.push(comment);
                                            campground.save();
                                            console.log("Comment added");
                                        }
                                    });
                            }
                        });
                    });
                }
            });
        }
    });
}


module.exports = seedDB;