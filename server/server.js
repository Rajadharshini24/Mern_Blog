const express=require("express");
const cors=require("cors");
const mongoose=require("mongoose");
require("dotenv").config();

const app=express();
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes=require("./routes/authRoutes");
const blogRoutes=require("./routes/blogRoutes");
const commentRoutes=require("./routes/commentRoutes");
const profileRoutes = require("./routes/profileRoutes");


//testing
app.use('/api/auth',authRoutes);
app.use('/api/blog',blogRoutes);
app.use('/api/comments',commentRoutes);
app.use("/api/profile", profileRoutes);



const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("connected to db");
    }catch(err){
        console.error("err in connectin Db",err.message);
        process.exit(1);
    }
};
connectDb();


const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`);
});

