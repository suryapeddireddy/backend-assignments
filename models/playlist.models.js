import mongoose from "mongoose";

const PlayListSchema=new mongoose.Schema({
name:{
type:String,
required:true
},
description:{
type:String,
required:true
},
videos:[
{
type:mongoose.Schema.Types.ObjectId;
ref:"Video"
}
],
owner:{
type:mongoose.Schema.Types.ObjectId,
ref:"User"
} 
}, {timestamps:true});

const PlayList=mongoose.model("PlayList",PlayListSchema);
export default PlayList;
