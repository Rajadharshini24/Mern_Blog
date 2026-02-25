const express=require('express');
const router=express.Router();
const verifyToken=require("../middleware/authMiddleware");
const {createBlog,getAllBlog,getSingleBlog,updateBlog,deleteBlog,likeBlog}=require("../controller/blogController");


router.post("/",verifyToken,createBlog);
router.get("/",getAllBlog);
router.get("/:id",getSingleBlog);
router.put("/:id",verifyToken,updateBlog);
router.delete("/:id",verifyToken,deleteBlog);
router.put("/like/:id", verifyToken, likeBlog);


module.exports=router;

