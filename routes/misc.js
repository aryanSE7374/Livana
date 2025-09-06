const express = require("express");
const router = express.Router();
const MiscController = require("../controllers/misc.js");
// miscellaneous privacy,terms etc

// router.get("/privacy" , (req,res)=>{
//   console.log("request for privacy recieved!");
//   console.log("------------------------------------------------------------------------");
//   res.render("listings/privacy.ejs");
// });

router.route("/privacy")
.get( MiscController.renderPrivacy);
router.route("/terms")
.get( MiscController.renderTerms);
router.route("/socialError")
.get( MiscController.renderSocialError);


module.exports = router;