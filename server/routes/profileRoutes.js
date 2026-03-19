const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Blog = require("../models/Blog"); // ✅ import Blog
const verifyToken = require("../middleware/authMiddleware");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Multer setup for profile images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, `${req.user.id}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

// GET logged-in user info
router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE profile (name, email, profile image)
router.put(
  "/me",
  verifyToken,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (req.body.name) user.name = req.body.name;
      if (req.body.email) user.email = req.body.email;

      if (req.file) {
        if (user.profileImage) {
          const oldImagePath = path.join(__dirname, "../", user.profileImage);
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
        user.profileImage = `/uploads/${req.file.filename}`;
      }

      await user.save();
      res.status(200).json({ message: "Profile updated", user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);

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