import Comment from '../models/Comment.models.js'
import User from "../models/User.models.js";
import Video from "../models/Video.models.js";
import Like from "../models/Like.models.js";

const getallComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const comments = await Comment.find({ video: videoId });
    return res
      .status(200)
      .json({ message: "comments fetched successfully", comments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in fetching comments", error });
  }
};

const postcomment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;
    const userId  = req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "video not found" });
    }
    const comment = new Comment({
      video: videoId,
      owner: userId,
      text,
      likes: 0,
    });
    video.comments=video.comments+1;
    await video.save();
    await comment.save();
    return res.status(200).json({ message: "comment posted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error in posting comment", error });
  }
};

const updatecomment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const  userId  = req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found" });
    }
    comment.text = text;
    comment.likes = 0;
    await comment.save();
    return res.status(200).json({ message: "comment updated successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "error in updating comment", error });
  }
};

const deletecomment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const  userId  = req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    const comment=await Comment.findById(commentId);
   if(!comment){
    return res.status(404).json({message:"comment not found"});
   }
    await comment.deleteOne();
    const videoId=comment.video;
    const video=await Video.findById(videoId);
    if(!video){
    return res.status(404).json({message:"video not found"});
    }
    video.comments=video.comments-1;
    await video.save();
    return res.status(200).json({ message: "comment deleted successfully" });
  } catch (error) {
  console.log(error);
    return res
      .status(500)
      .json({ message: "error in deleting comment"});
  }
};
const GetCommentId=async(req,res)=>{
try {
const userId=req.user?._id;
const {text}=req.body;
const {videoId}=req.params;
const comment=await Comment.findOne({owner:userId,text:text,video:videoId});
if(!comment){
return res.status(404).json({message:"comment not found"});
}
return res.status(200).json({message:"comment found",comment});
} catch (error) {
  return res.status(500).json({message:"error in getting comment",error});
}
}
  
export { getallComments, postcomment, updatecomment, deletecomment,GetCommentId };
