const Comment=require("../models/Comment");
const Blog=require("../models/Blog");
const mongoose=require('mongoose');

exports.addComment=async(req,res)=>{
    try{
        const {text,blogId}=req.body;
        if(!text){
            return res.status(400).json({message:"text not found"});
        }
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({ message: "Invalid blog ID" });
        }
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        const userId=req.user.id;
        const comment=new Comment({text,blogId,userId});
        const savedComment=await comment.save();
        await Blog.findByIdAndUpdate(blogId, {
            $inc: { commentCount: 1 }
        });
        res.status(201).json({message:"comment created successfully",savedComment});

    }catch(err){
        res.status(500).json({message:err.message});
    }
}

exports.getComment=async(req,res)=>{
    try{
        const {blogId}=req.params;
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({message: "Invalid blog ID"});
        }
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        const allComment=await Comment.find({blogId})
            .populate("userId", "name profileImage")
            .sort({"createdAt":-1});
         res.status(200).json({
            count:allComment.length,
            comment:allComment,
            message:"Fetched all comment"
        });

    }catch(err){
        res.status(500).json({message:err.message});
    }
}

exports.deleteComment=async(req,res)=>{
    try{
        const {id}=req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({message: "Invalid comment ID"});
        }
        
        const comment=await Comment.findById(id);
        if(!comment){
            return res.status(404).json({message:"comment not found!"});
        }
        if(comment.userId.toString()!=req.user.id){
            return res.status(403).json({message:"Not authorised to delete the comment"});
        }
        await Comment.findByIdAndDelete(id);
        await Blog.findByIdAndUpdate(comment.blogId, {
            $inc: { commentCount: -1 }
        });
        res.status(200).json({
            message:"comment deleted successfully"
        });
    }catch(err){
        res.status(500).json({message:err.message});
    }
}
