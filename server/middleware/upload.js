const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary"); // your Cloudinary config
const multer = require("multer");

// Storage config for profile images in Cloudinary
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_images", // Cloudinary folder
    format: async (req, file) => "png", // optional: convert all images to png
    public_id: (req, file) => req.user.id, // use user ID as filename
  },
});

const uploadProfile = multer({ storage: profileStorage });

module.exports = uploadProfile;