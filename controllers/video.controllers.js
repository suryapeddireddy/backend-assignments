import Video from '../models/Video.models.js';
import { uploadImage } from '../utils/cloudinary.js';
const UploadVideo = async (req, res) => {
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
      const videourl = await uploadImage(videopath, `${name}/videourl`).secure_url;
      const thumbnailurl = await uploadImage(thumbnailpath, `${name}/thumbnailurl`).secure_url;
  
      // Retrieve video duration (if possible from the video file)
      const duration = req.files['video'][0].duration; // Ensure duration is available before use
  
      // Save video details to database
      const uploadvideotodb = {
        title,
        description,
        views: 0,
        owner: userid,
        thumbnail:thumbnailurl,
        video:videourl,
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
}

const getVideoById=async(req,res)=>{

}

const updateVideo=async(req,res)=>{

}
const DeleteVideo=async(req,res)=>{

}

export  {UploadVideo,getAllVideos,getVideoById,updateVideo,DeleteVideo};


