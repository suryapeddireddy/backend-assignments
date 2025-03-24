import Like from "../models/Like.models.js";
import Video from '../models/Video.models.js'
import  User from '../models/User.models.js'
import Comment from '../models/Comment.models.js'

const toggleVideoLike=async(req,res)=>{
try {
const {videoId}=req.params;
const userId=req.user?._id;
const video=await Video.findById(videoId);
if(!video){
return res.status(404).json({message:"video not found"});
}
const isvideoliked=await Like.findOne({owner:userId, video:videoId});
if(isvideoliked){
//remove the like
await Like.findByIdAndDelete(isvideoliked._id);
video.likes=video.likes-1;
await video.save();
return res.status(200).json({message:"like removed"});
}
const like=new Like({owner:userId, video:videoId});
await like.save();
video.likes=video.likes+1;
await video.save();
return res.status(200).json({message:"Like added"});
} catch (error) {
return res.status(500).json({message:"Internal server error"});
}
}

const toggleCommentLike=async(req,res)=>{
try {
const {commentId}=req.params;
const userId=req.user?._id;
const comment=await Comment.findById(commentId);
if(!comment){
return res.status(404).json({message:"comment not found"});
}
const isCommentLiked=await Like.findOne({owner:userId, comment:commentId});
if(isCommentLiked){
// remove the like
await Like.findByIdAndDelete(isCommentLiked._id);
comment.likes=comment.likes-1;
await comment.save();
return res.status(200).json({message:"like removed"});
}
const like=new Like({owner:userId, comment:commentId});
await like.save();
comment.likes=comment.likes+1;
await comment.save();
return res.status(200).json({message:"like added"});
} catch (error) {
return res.status(500).json({message:"Internal server error"});
}
}

const getLikedVideos=async(req,res)=>{
try {
const userId=req.user?._id;
const user=await User.findById(userId);
if(!user){
return res.status(404).json({message:"user not found"});
}
const likedVideos=await Like.find({owner:userId}).populate('video');
return res.status(200).json({message:"Liked videos fetched", likedVideos});
} catch (error) {
return res.status(500).json({message:"Internal server error"});    
}
}
export {toggleCommentLike, toggleVideoLike, getLikedVideos};

