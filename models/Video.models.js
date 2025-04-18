import mongoose from "mongoose";
const VideoSchema=new mongoose.Schema({
title:{
type:String,
required:true
},
description:{
type: String,
required:true
},
owner :{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
},
video:{
type:String,
required:true
},
thumbnail:{
type:String,
required:true
},
duration:{
type:String,
},
views:{
type:Number,
default:0
},
likes:{
type:Number,
default:0
},
comments:{
type:Number,
default:0
}
},{timestamps:true});

const Video=mongoose.model("Video", VideoSchema);
export default Video;
