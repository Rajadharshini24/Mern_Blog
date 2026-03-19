const multer = require("multer");
const path = require("path");

// Storage config for profile images
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder where profile images will be saved
  },
  filename: (req, file, cb) => {
    // Use user ID + original extension
    cb(null, `${req.user.id}${path.extname(file.originalname)}`);
  },
});

const uploadProfile = multer({ storage: profileStorage });

module.exports = uploadProfile;