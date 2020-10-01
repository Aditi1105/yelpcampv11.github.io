var express =require("express"),
    router =express.Router(),
    Campground = require("../models/campground"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");



// INDEX -SHOW ALL CAMPGROUNDS
router.get("/",function(req,res){
   
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds: allCampgrounds , currentUser: req.user});
        }
    });
     
 });
 
 //-------------------------------------------------------------------------------------------------
// CREATE - ADD NEW DATA TO DB
//-------------------------------------------------------------------------------------------------
 router.post("/", middleware.isLoggedIn , function(req,res){
    var name =req.body.name;
    var price =req.body.price; 
    var image =req.body.image;
    var desc =req.body.description;
    var author = {
        id: req.user.id,
        username: req.username
    }
    var newCampground ={name: name,price: price, image: image, description:desc, author:author}
    
    
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    })
   
 });
 
 // New - show form to create  new campground
 router.get("/new", middleware.isLoggedIn, function(req,res){
     res.render("campgrounds/new");
 });
 
 router.get("/:id",function(req,res){
 
     Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
          if(err){
              console.log(err);
          }
          else{
              console.log(foundCampground);
              res.render("campgrounds/show",{campground: foundCampground});
          }
 
     });
       
 });
//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership,  function(req,res){
        Campground.findById(req.params.id, function(err,foundCampground){

            res.render("campgrounds/edit",{campground: foundCampground});
        });

});


//UPdate Campground Route
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
     
});

// DESTORY CAMPGROUND ROUTE
router.delete("/:id",  middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});

 module.exports =router;