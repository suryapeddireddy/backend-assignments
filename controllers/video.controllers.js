import Video from '../models/Video.models.js';
import { uploadImage ,uploadVideo} from '../utils/cloudinary.js';
import ffmpeg from 'fluent-ffmpeg'; 

const publishaVideo = async (req, res) => {
  try {
      const { title, description } = req.body;
      const userid = req.user?.id;
      const name = req.user?.username;

      if (!userid) {
          return res.status(401).json({ message: "Unauthorized request" });
      }

      // Get video file from Multer upload
      const videopath = req.files['video'] ? req.files['video'][0].path : null;
     
      if (!videopath) {
          return res.status(400).json({ message: "Video is required" });
      }

      // Get thumbnail file from Multer upload
      const thumbnailpath = req.files['thumbnail'] ? req.files['thumbnail'][0].path : null;
      if (!thumbnailpath) {
          return res.status(400).json({ message: "Thumbnail is required" });
      }
      

      // Upload the video and thumbnail to Cloudinary
      const video = await uploadVideo(videopath, `${name}/videourl`);
      const thumbnail = await uploadImage(thumbnailpath, `${name}/thumbnailurl`);
     console.log(video);
      // Extract video duration using ffmpeg
      const duration = req.files['video'].duration;

      // Save video details to database
      const uploadvideotodb = {
          title,
          description,
          views: 0,
          owner: userid,
          thumbnail: thumbnail.secure_url,
          video: video.secure_url,
          duration,
      };

      const newVideo = new Video(uploadvideotodb); // Create a new Video document
      await newVideo.save(); // Save to DB

      return res.status(200).json({ message: "Uploaded video successfully" });

  } catch (error) {
      console.log("Error uploading video", error);
      return res.status(500).json({ message: "Internal Server Error" }); // Return proper error response
  }
}


const getAllVideos=async(req,res)=>{
//write a code
try {
    const page = parseInt(req.query.page) || 1;  // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    const query = req.query.query || ""; // Search term
    const sortBy = req.query.sortBy || "createdAt"; // Sort field
    const sortType = req.query.sortType === "desc" ? -1 : 1; // Ascending (1) or Descending (-1)
    const userId = req.query.userId; // Optional filter by user ID

    let filter={};
    if(query){
    filter.title={$regex:query,$options:"i"}; //case-insensitivesearch, regex isfor pattern matching, if dont include i it will become case sensitive
    }
   if(userId){
   filter.owner=userId;
   }
   const skip=(page-1)*limit;
   const videos=await Video.find(filter).skip(skip).sort({[sortBy]:sortType});
   return res.status(200).json({videos});
} catch (error) {
  return res.status(500).json({message:"Failed to get videos"});  
}
}

const getVideoById=async(req,res)=>{
try {
const video=await Video.findById(req.params.id);
if(!video){
return res.status(404).json({message:"video not found"});
}
return res.status(200).json(video);
} catch (error) {
 return res.status(500).json({message:"unable to fetch video"});   
}
}

const updateVideo = async (req, res) => {
    try {
      const videoId = req.params.videoId.trim(); // Correctly extract video ID
      console.log(req.params); // For debugging purposes
      
      const { title, description } = req.body;
      
      // Check if the thumbnail file exists
      const thumbnaillocalpath = req.files && req.files['thumbnail'] ? req.files['thumbnail'][0].path : null;
      
      // Find video by ID
      const video = await Video.findById(videoId);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      // Ensure the user is authorized
      if (String(req.user?._id) !== String(video.owner)) {
        return res.status(403).json({ message: "Unauthorized request" });
      }
      
      // Update fields only if they exist in the request body
      if (title) video.title = title;
      if (description) video.description = description;
      
      // Handle thumbnail upload if a new file is provided
      if (thumbnaillocalpath) {
        const thumbnail = await uploadImage(thumbnaillocalpath, `${req.user?.username}/thumbnailurl`);
        video.thumbnail = thumbnail.secure_url;
      }
      
      // Save the updated video
      await video.save();
      
      return res.status(200).json({
        message: "Video updated successfully",
        video,
      });
    } catch (error) {
      console.error(error); // For debugging purposes
      return res.status(500).json({ message: "Unable to update video", error });
    }
  };
  
  
const DeleteVideo=async(req,res)=>{
try {
  const {videoId}=req.params;
  const deletedvideo=await Video.findByIdAndDelete(videoId);
  if(!deletedvideo){
  return res.status(404).json({message:"Video not found"});
  }
  return res.status(200).json({message:"video deleted"});
} catch (error) {
  return res.status(500).json({message:"Unable to delete video"});
}
}

export  {publishaVideo,getAllVideos,getVideoById,updateVideo,DeleteVideo};


