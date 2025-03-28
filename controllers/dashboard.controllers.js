import Video from "../models/Video.js";
import Comment from '../models/Comment.models.js'
const GetchannelVideos=async(req,res)=>{
try {
const {channelId}=req.params;
if(!channelId){
return res.status(400).json({message:"channelId is required"});
}
const channelVideos=await Video.find({owner:channelId});
return res.status(200).json({channelVideos});
} catch (error) {
return res.status(500).json({message:error.message});
}
}

const GetAllUserComments=async(req,res)=>{
try {
const userId=req.user?._id;
const comments=await Comment.find({owner:userId});
return res.status(200).json({comments});
} catch (error) {
  return res.status(500).json({message:"error fetching User comments", error:error.message});  
}
}

export {GetchannelVideos, GetAllUserComments};