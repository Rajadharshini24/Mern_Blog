const Blog=require("../models/Blog");
const mongoose = require("mongoose");

exports.createBlog=async(req,res)=>{
    try{
        const {title,content,tags,category}=req.body;
        if(!title||!content||!category){
            return res.status(400).json({message:"please provide required details"});
        }
        const newBlog=new Blog({
            title,content,author:req.user.id,tags:tags||[],category
        });
        const savedBlog=await newBlog.save();
        res.status(201).json({
            message:"BLog created successfully",
            blog:savedBlog
        });
        
    }catch(err){
        res.status(500).json({message:err.message});
    }
}
exports.getAllBlog=async(req,res)=>{
    try{
        const page=parseInt(req.query.page)||1;
        const limit=parseInt(req.query.limit)||5;
        const skip=(page-1)*limit;

        const search=req.query.search;
        let filter={};
        if(search){
            filter={
                $or:[
                    {title:{$regex:search,$options:"i"}},
                    {tags:{$regex:search,$options:"i"}}
                ]
            };
        }
        const blog=await Blog.find(filter).skip(skip).limit(limit)
                .populate("author", "name email")
                .sort({ createdAt: -1 });
        return res.status(200).json({
            count:blog.length,
            blogs:blog,
            message: search ? "Fetched related blogs" : "Fetched all blogs"
        });
    }catch(err){
        res.status(500).json({message:err.message});
    }
}
exports.getSingleBlog=async(req,res)=>{
    try{
        const {id}=req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid blog ID"
            });
        }

        const blog=await Blog.findById(id).populate("author","name email");
        if(!blog){
            return res.status(404).json({message:"blog not found!"});
        }
        blog.views+=1;
        await blog.save();
        res.status(200).json({
            message:"Blog fetched!",
            blog
        })
    }catch(err){
        res.status(500).json({message:err.message});
    }
}
exports.updateBlog=async(req,res)=>{
    try{
        const{title,content,tags,category}=req.body;
        const {id}=req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid blog ID"
            });
        }

        const blog=await Blog.findById(id);
        if(!blog){
            return res.status(404).json({message:"blog not found!"});
        }
        if(blog.author.toString()!=req.user.id){
            return res.status(403).json({message: "Not authorized to update this blog"});
        }
        if(title) blog.title=title;
        if(content) blog.content=content;
        if(tags) blog.tags=tags;
        if(category) blog.category=category;

        await blog.save();
        res.status(200).json({
            message:"blog saved successfully",
            blog
        }); 
    }catch(err){
        res.status(500).json({message:err.message});
    }
}
exports.deleteBlog=async(req,res)=>{
    try{
        const {id}=req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid blog ID"
            });
        }

        const blog=await Blog.findById(id);
        if(!blog){
            return res.status(404).json({message:"blog not found!"});
        }
        if(blog.author.toString()!=req.user.id){
            return res.status(403).json({message: "Not authorized to delete this blog"});
        }
        await Blog.findByIdAndDelete(id);
        res.status(200).json({
            message:"blog deleted successfully"
        });
   
    }catch(err){
        res.status(500).json({message:err.message});
    }
}

exports.likeBlog=async(req,res)=>{
    try{
        const {id}=req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid blog ID"
            });
        }

        const blog=await Blog.findById(id);
        if(!blog){
            return res.status(404).json({message:"blog not found!"});
        }
        
        const userId=req.user.id;
        const alreadyLiked = blog.likes.users.includes(userId);

        if (alreadyLiked) {
            blog.likes.users = blog.likes.users.filter(likeId => likeId.toString() !== userId);
        } else {
            blog.likes.users.push(userId);
        }

        blog.likes.count = blog.likes.users.length;
        await blog.save();

        res.status(200).json({
            message: alreadyLiked ? "Blog unliked" : "Blog liked",
            likesCount: blog.likes.count
        });

    }catch(err){
        res.status(500).json({message:err.message});
    }
}