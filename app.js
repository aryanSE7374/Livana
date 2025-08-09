const PORT = 8080;

if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// const {listingSchema , reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


// ------------------------------------------------------------------------------------------- //

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

// ------------------------------------------------------------------------------------------- //

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));
// app.use(express.json());

const sessionOptions = {
  secret : "supersecretcode",
  resave : false,
  saveUninitialized : true,
  cooke : {
    expires : Date.now() + 7*24*60*60*1000 ,
    maxAge :  7*24*60*60*1000 ,
    httpOnly : true ,
  }
};

// ------------------------------------------------------------------------------------------- //

app.get("/" , (req,res)=>{
  res.send("Welcome to the root!");
  console.log("--------------------------------root------------------------------------");
});

// ------------------------------------------------------------------------------------------- //

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req , res , next)=>{
  res.locals.success = req.flash("success"); // if there exists a success message , then only it will send the data to the viewport engine(s)
  res.locals.error = req.flash("error");
  // to make sure the currently logged-in user infomration is accessible in every EJS file without passing it explicitly every time.
  res.locals.currUser = req.user;
  // console.log("res.locals.success : ",res.locals.success);
  next();
});

/*
// test : demo User creation
app.get("/demoUser" , async (req , res) => {
  let fakeUser = new User({
    username : "demouser123" , 
    email : "demoemail@xyz.com",
  });

  let registeredUser = await User.register(fakeUser , "demopassword@123");
  res.send(registeredUser);
});

*/

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);


// ------------------------------------------------------------------------------------------- //



// these two not worked , hence commented

// * route try , not even this one

// app.all("*",(req , res , next)=>{
//   next(new ExpressError(404,"Page not found!"));
// });


// app.all("/*", (req, res, next) => {
//     next(new ExpressError(404, "Page not found!"));
// });


// ------------------------------------------------------------------------------------------- //
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

// ------------------------------------------------------------------------------------------- //

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

