import Video from "../models/Video.js";

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

export {Getstats,GetchannelVideos};