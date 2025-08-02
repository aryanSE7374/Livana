const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup" , (req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup" , wrapAsync(async  (req,res)=>{
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
}));

router.get("/login" , (req,res)=>{
    res.render("users/login.ejs");
});

router.post(
    "/login" , 
    saveRedirectUrl,
    passport.authenticate('local',{ 
        failureRedirect: '/login' , 
        failureFlash : true, 
    }) , 
    async (req,res)=>{
        req.flash("success" , "Welcome back to Livana!");
        let redirectUrl = res.locals.redirectUrl || "/listings"; // this is to get rid off logging in from the lisitng page
        // as loggin in from the lisitng page does not trigger the isLoggedIn middleware hence redirectUrl reamins an empty object
        res.redirect(redirectUrl);
    }
);

router.get("/logout" , (req , res , next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success" , "you are logged out!");
        res.redirect("/listings");
    });
});

module.exports = router;