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
required:true
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
required:true
},
views:{
type:Number,
required:true
}
},{timestamps:true});

const Video=mongoose.model("Video", VideoSchema);
export default Video;
