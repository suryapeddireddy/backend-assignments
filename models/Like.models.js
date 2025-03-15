import mongoose from "mongoose";

const LikeSchema=new mongoose.Schema({
owner:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
},
video:{
type:mongoose.Schema.Types.ObjectId,
ref:"Video"
},
comment:{
type:mongoose.Schema.Types.ObjectId,
ref:"Comment"
}
})

 const Like=mongoose.model("Like",LikeSchema);
 export default Like;