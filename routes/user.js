const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const UserController = require("../controllers/users.js");

router.get("/signup" , UserController.renderSignupForm);

router.post("/signup" , wrapAsync(UserController.signup));

router.get("/login" , UserController.getLoginForm);

router.post(
    "/login" , 
    saveRedirectUrl,
    passport.authenticate('local',{ 
        failureRedirect: '/login' , 
        failureFlash : true, 
    }) , 
    UserController.login
);

router.get("/logout" , UserController.logout);

router.get("/profile", isLoggedIn, wrapAsync(UserController.renderProfile));

module.exports = router;