const PORT = 8080;


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");


const MONGO_URL = "mongodb://127.0.0.1:27017/livana";

main()
  .then(()=>{
    console.log("connected to DB");
  })
  .catch((err)=>{
    console.log(err);
  })


async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));

app.get("/" , (req,res)=>{
    res.send("Welcome to the root!");
});

// Index route : to get all Listings
// GET/listings

app.get("/listings" , async (req , res)=>{
  
  const allListings = await Listing.find({});
  res.render("listings/index.ejs" , {allListings});
});


// New and Create Route
// 1. GET/listings/new -> returns a form
// 2. On Submitting the from -> POST/listings

// New Route
app.get("/listings/new" , (req,res)=>{
  res.render("listings/new.ejs");
});

// Create Route
app.post("/listings" , async (req , res)=>{
  // let {title , description , image, price , country , location} = req.body;
  // let listing = req.body.listing;
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("listings");
  // console.log(listing);
});

// Delete Route 
// DELETE/listings/:id

app.delete("/listings/:id" , async (req,res)=>{
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

// Read or Show Route : to view specific listings data 
// GET/listings/:id

app.get("/listings/:id", async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs" , {listing});
});


// Update : Edit and Update Route

// 1. Edit Route -> GET/listings/:id/edit => returns edit form
app.get("/listings/:id/edit" , async (req,res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs" , {listing});
})

// 2. Update route -> On submitting the form => PUT/listings/:id
app.put("/listings/:id" , async (req , res)=>{
  let {id} = req.params;
  // need more explaination...how deconstructed and req.body from where??
  await Listing.findByIdAndUpdate(id , {...req.body.listing});
  // res.redirect("/listings");
  res.redirect(`/listings/${id}`);

});




/*
// test route

app.get("/testListing" , async (req , res)=>{
  let sampleListing = new Listing({
    title : "My New Villa",
    description : "By the beach",
    price : 1200,
    location : "Dubai",
    country : "United Arab Emirates", 
  });
  await sampleListing.save();
  console.log("sample was saved");
  res.send("Successful testing");
  
});
*/

app.listen(PORT , ()=>{
    console.log(`server is listening to port : ${PORT}`);
    
});