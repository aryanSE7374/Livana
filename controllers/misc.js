// miscellaneous

module.exports.renderPrivacy = (req,res)=>{
  console.log("request for privacy recieved!");
  console.log("------------------------------------------------------------------------");
  res.render("listings/privacy.ejs");
};

module.exports.renderTerms = (req,res)=>{
  console.log("request for terms recieved!");
  console.log("------------------------------------------------------------------------");
  res.render("listings/terms.ejs");
};

module.exports.renderSocialError = (req,res)=>{
  console.log("social error rendered!");
  console.log("------------------------------------------------------------------------");
  res.render("listings/socialError.ejs");
};

