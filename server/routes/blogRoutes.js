const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { createBlog, getAllBlog, getSingleBlog, updateBlog, deleteBlog, likeBlog } = require("../controller/blogController");
const upload = require("../middleware/upload");

// ✅ Create blog

router.post("/", verifyToken, upload.single("image"), createBlog);

// ✅ Update blog with optional new image
router.put("/:id", verifyToken, upload.single("image"), updateBlog);

// ✅ Other routes
router.get("/", getAllBlog);
router.get("/:id", getSingleBlog);
router.delete("/:id", verifyToken, deleteBlog);
router.put("/like/:id", verifyToken, likeBlog);

module.exports = router;