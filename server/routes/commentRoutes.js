const express=require('express');
const router=express.Router();
const  verifyToken=require("../middleware/authMiddleware");
const {addComment,getComment,deleteComment}=require("../controller/commentController");

router.post("/",verifyToken,addComment);
router.get("/:blogId",getComment);
router.delete("/:id",verifyToken,deleteComment);

module.exports=router;
