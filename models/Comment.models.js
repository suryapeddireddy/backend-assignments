import mongoose from "mongoose";

const CommentSchema= new mongoose.Schema(
{
video:{
type:mongoose.Schema.Types.ObjectId,
ref:"Video"
},
owner:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},
text:{
type:String,
required:true
}
}
);

const Comment=mongoose.model("Comment",CommentSchema);
export default Comment;