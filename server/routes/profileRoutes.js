const express = require("express");
const router = express.Router();
const User = require("../models/User");
const verifyToken = require("../middleware/authMiddleware");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary storage for profile images
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profile_images", // Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => `user_${req.user.id}`, // overwrite if user re-uploads
  },
});

const upload = multer({ storage });

// ----------------- ROUTES -----------------

// GET logged-in user info
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user }); // profileImage is already Cloudinary URL
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE logged-in user info (with profile image)
router.put("/me", verifyToken, upload.single("profileImage"), async (req, res) => {
  try {
    console.log("req.file:", req.file); // debug
    console.log("req.body:", req.body);

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;

    // ✅ Use Cloudinary URL if file uploaded
    if (req.file && req.file.path) {
      user.profileImage = req.file.path; // full Cloudinary URL
    }

    await user.save();
    res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET all blogs by logged-in user
router.get("/blogs/me", verifyToken, async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ blogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET liked blogs by logged-in user
router.get("/blogs/liked/me", verifyToken, async (req, res) => {
  try {
    const blogs = await Blog.find({ "likes.users": req.user.id })
      .populate("author", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({ blogs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;