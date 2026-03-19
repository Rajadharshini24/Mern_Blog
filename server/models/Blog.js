const mongoose=require('mongoose');

const blogSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required:true,
            trim:true,
            minlength:3,
            maxlength:100
        },
        content:{
            type:String,
            required:true,
            minlength:30,
            trim:true
        },
        author:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true

        },
        image: {
      type: String,
      default: "",
    },
        tags:{
            type:[String],
            trim:true,
            minlength:3

        },
        category:{
            type:String,
            enum:["Programming","Tech","Tutorial","career","others"],
            required:true
        
        },
        likes: {
            users: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
                }
            ],
            count: {
                type: Number,
                default: 0
            }
        },
        views:{
            type:Number,
            default:0,
            min:0
        },
        commentCount:{
            type:Number,
            default:0,
            min:0
        }
    },{timestamps:true}
);
module.exports=mongoose.model("Blog",blogSchema);