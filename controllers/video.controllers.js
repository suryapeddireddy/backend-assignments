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
}

const getVideoById=async(req,res)=>{

}

const updateVideo=async(req,res)=>{

}
const DeleteVideo=async(req,res)=>{

}

export  {publishaVideo,getAllVideos,getVideoById,updateVideo,DeleteVideo};


