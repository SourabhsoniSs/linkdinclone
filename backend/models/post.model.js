import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({

    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    description:{
        type:String,
        default:""
    },
    image:{
        type:String
    },
    like:[
        {
             type:mongoose.Schema.Types.ObjectId,
             ref:"User"
        }
    ],
    comments:[
        {
            content:{type:String},
            user:{
                 type:mongoose.Schema.Types.ObjectId,
            }
        }
    ]


},{timestamps:true})

const Post=mongoose.model("Post",postSchema);

export default Post