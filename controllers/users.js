const User = require("../models/user.js");
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async  (req,res)=>{
    try {
        let {username , email , password} = req.body;
        // console.log("req.body -- ",req.body); 
        // NEVER log passwords or store them
        const newUser = new User({email , username});
        const registeredUser = await User.register(newUser , password);
        console.log("new User registered :- ",registeredUser);
        req.login( registeredUser , (err)=>{
            if(err){
                return next(err);
            }
            console.log("------------------------------------------------------------------------");
            req.flash("success" , "Welcome to Livana!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
};

module.exports.getLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

// not actually the login but the controller after authentication(login)
module.exports.login = async (req,res)=>{
    req.flash("success" , "Welcome back to Livana!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // this is to get rid off logging in from the lisitng page
    // as loggin in from the lisitng page does not trigger the isLoggedIn middleware hence redirectUrl reamins an empty object
    res.redirect(redirectUrl);
};

module.exports.logout = (req , res , next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success" , "you are logged out!");
        res.redirect("/listings");
    });
};

module.exports.renderProfile = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const allBookings = await Booking.find({ guest: req.user._id })
        .populate("listing")
        .sort({ checkIn: -1 });

    const upcomingBookings = allBookings.filter(b => new Date(b.checkIn) >= today);
    const pastBookings = allBookings.filter(b => new Date(b.checkIn) < today);

    const myListings = await Listing.find({ owner: req.user._id });
    const myListingIds = myListings.map(l => l._id);

    const receivedBookings = await Booking.find({ listing: { $in: myListingIds } })
        .populate("guest")
        .populate("listing")
        .sort({ checkIn: -1 });

    res.render("users/profile.ejs", {
        upcomingBookings,
        pastBookings,
        myListings,
        receivedBookings
    });
};