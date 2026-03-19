const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const {createBlog,getAllBlog,getSingleBlog,updateBlog,deleteBlog,likeBlog} = require("../controller/blogController");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ----------------- CLOUDINARY STORAGE -----------------
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blog_images", // Folder on Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => `blog_${Date.now()}`, // Unique file name
  },
});
const upload = multer({ storage });

// ----------------- ROUTES -----------------

// Create a new blog (with optional image)
router.post("/", verifyToken, upload.single("image"), createBlog);

// Get all blogs (with pagination and search)
router.get("/", getAllBlog);

// Get single blog by ID
router.get("/:id", getSingleBlog);

// Update blog by ID (with optional new image)
router.put("/:id", verifyToken, upload.single("image"), updateBlog);

// Delete blog by ID
router.delete("/:id", verifyToken, deleteBlog);

// Like / Unlike blog
router.post("/:id/like", verifyToken, likeBlog);

module.exports = router;