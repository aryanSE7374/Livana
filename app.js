const PORT = 8080;


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");




// testing the error object

// console.log(ExpressError);
// errorObj = new ExpressError(404 , "my message");
// console.dir(errorObj);
// console.log(errorObj.statusCode); 



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
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));

app.get("/" , (req,res)=>{
    res.send("Welcome to the root!");
    console.log("--------------------------------root------------------------------------");
});


const validateListing = (req , res , next)=>{
  console.log("validateListing is being called!");
  let {error} = listingSchema.validate(req.body);
  console.dir(error);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    console.log("errMsg = ",errMsg);
    throw new ExpressError(400 , errMsg);
  }else{
    next();
  }
}


// Index route : to get all Listings
// GET/listings

app.get("/listings" , wrapAsync(
  async (req , res)=>{
    console.log("get request recieved!");
    const allListings = await Listing.find({});
    console.log("------------------------------------------------------------------------");
    res.render("listings/index.ejs" , {allListings});
}));


// New and Create Route
// 1. GET/listings/new -> returns a form
// 2. On Submitting the from -> POST/listings

// New Route
app.get("/listings/new" , (req,res)=>{
  console.log("request for new form recieved!");
  console.log("------------------------------------------------------------------------");
  res.render("listings/new.ejs");
});

// Create Route

app.post("/listings" , validateListing, wrapAsync (async (req , res, next )=>{
    // let {title , description , image, price , country , location} = req.body;
    // let listing = req.body.listing;
    console.log("post request recieved");
    console.log("req.body: -- ",req.body);

    const newListing = new Listing(req.body.listing);
    console.log(`new listing object created : ${newListing}`);

    // -----------------------------method 1---------------------------------- //
    /*
    if (!newListing.title) {
        // If title is missing, throw an ExpressError with status 400
        throw new ExpressError(400, "Title is missing!");
    }

    // Validate if description is missing
    if (!newListing.description) {
        // If description is missing, throw an ExpressError with status 400
        throw new ExpressError(400, "Description is missing!");
    }

    // Validate if location is missing
    if (!newListing.location) {
        // If location is missing, throw an ExpressError with status 400
        throw new ExpressError(400, "Location is missing!");
    }
    */
    // ------------------------------------------------------------------------ //


    // -----------------------------method 2---------------------------------- //
    // using validateListing middleware within the post argument as a callback before wrapAsync
    // ------------------------------------------------------------------------ //



    // console.log(newListing);
    await newListing.save();
    console.log("newListing saved successfully! redirecting to the listings home page...");
    console.log("------------------------------------------------------------------------");
    res.redirect("/listings");
}));

// Delete Route 
// DELETE/listings/:id

app.delete("/listings/:id" , wrapAsync(
  async (req,res)=>{
    let {id} = req.params;
    console.log(`delete request recieved for the id : ${id}`);
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("deleted listing : ");
    console.log(deletedListing);
    console.log("redirecting to the listings home page...");
    console.log("------------------------------------------------------------------------");
    res.redirect("/listings");
    }
)); 

// Read or Show Route : to view specific listings data 
// GET/listings/:id

app.get("/listings/:id", wrapAsync(
  async (req,res)=>{
    let {id} = req.params;
    console.log(`request recieved to show the details of id : ${id}`);
    const listing = await Listing.findById(id);
    console.log("------------------------------------------------------------------------");
    res.render("listings/show.ejs" , {listing});
  }
));


// Update : Edit and Update Route

// 1. Edit Route -> GET/listings/:id/edit => returns edit form
app.get("/listings/:id/edit" , wrapAsync(
  async (req,res)=>{
    let {id} = req.params;
    console.log(`edit request recieved to get the form to edit details of id : ${id}`);
    const listing = await Listing.findById(id);
    console.log("------------------------------------------------------------------------");
    res.render("listings/edit.ejs" , {listing});
  }
));

// 2. Update route -> On submitting the form => PUT/listings/:id
app.put("/listings/:id" , validateListing, wrapAsync(
  async (req , res)=>{
    let {id} = req.params;
    console.log(`put request recieved for the id : ${id}`);
    // need more explaination...how deconstructed and req.body from where??
    await Listing.findByIdAndUpdate(id , {...req.body.listing});
    console.log("------------------------------------------------------------------------");
    // res.redirect("/listings");
    res.redirect(`/listings/`);

  }
));



// ------------------------------------------------------------------------ //

// these two not worked , hence commented

// * route try , not even this one

// app.all("*",(req , res , next)=>{
//   next(new ExpressError(404,"Page not found!"));
// });


// app.all("/*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found!"));
// });


// ------------------------------------------------------------------------ //
// this worked

app.all(/.*/, (req, res, next) => {
    console.log("all request for * route recieved...");
    console.log("------------------------------------------------------------------------");
    next(new ExpressError(404, "Page not found!"));
});

app.use((err, req , res , next)=>{
  // res.send("something went wrong!");
  console.log("error middle-ware is being called");
  console.log("------------------------------------------------------------------------");
  let {statusCode=500 , message="Something went wrong!"} = err;
  // console.log(message);
  console.log(err);
  console.log("------------------------------------------------------------------------");
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});

// ------------------------------------------------------------------------ //

app.listen(PORT , ()=>{
    console.log(`server is listening to port : ${PORT}`);
    console.log("------------------------------------------------------------------------");
});




// app.use('*', (req, res) => {
//   res.status(404).send('Not Found');
// });

// // custom error handler middleware

// app.use((err, req , res , next)=>{
//   // res.send("something went wrong!");
//   let {statusCode , message} = err;
//   res.status(statusCode).send(message);
// });

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

