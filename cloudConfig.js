const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// to attach backend with cloudinary account we configure it with .env credintials
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// to set-up storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'livana_DEV',
    allowedFormats: ["png", "jpg", "jpeg"], // supports promises as well
  },
});
 
module.exports = {cloudinary , storage};
// these are used in listings routes