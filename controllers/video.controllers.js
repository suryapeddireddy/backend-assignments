import Video from "../models/Video.models.js";
import { uploadImage, uploadVideo } from "../utils/cloudinary.js";

const publishaVideo = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user?.id;
    const name = req.user?.username;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const videoFile = req.files["video"]?.[0];
    const thumbnailFile = req.files["thumbnail"]?.[0];

    if (!videoFile || !thumbnailFile) {
      return res.status(400).json({ message: "Video and thumbnail are required" });
    }

    // Upload video and thumbnail
    const uploadedVideo = await uploadVideo(videoFile.path, `${name}/videourl`);
    const uploadedThumbnail = await uploadImage(thumbnailFile.path, `${name}/thumbnailurl`);

    const newVideo = new Video({
      title,
      description,
      views: 0,
      owner: userId,
      thumbnail: uploadedThumbnail.secure_url,
      video: uploadedVideo.secure_url,
      duration: uploadedVideo.duration, // duration from Cloudinary response
    });

    await newVideo.save();

    return res.status(200).json({ message: "Uploaded video successfully" });

  } catch (error) {
    console.error("Error uploading video:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const query = req.query.query || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortType = req.query.sortType === "desc" ? -1 : 1;
    const userId = req.query.userId;

    const filter = {};
    if (query) filter.title = { $regex: query, $options: "i" };
    if (userId) filter.owner = userId;

    const skip = (page - 1) * limit;
    const videos = await Video.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortType });

    const totalCount = await Video.countDocuments(filter);

    return res.status(200).json({ videos, totalCount });

  } catch (error) {
    return res.status(500).json({ message: "Failed to get videos" });
  }
};

const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch video" });
  }
};

const updateVideo = async (req, res) => {
  try {
    const videoId = req.params.videoId?.trim();
    if (!videoId) {
      return res.status(400).json({ message: "Video ID is required" });
    }

    const { title, description } = req.body;
    const thumbnailFile = req.files?.["thumbnail"]?.[0];
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (String(req.user?._id) !== String(video.owner)) {
      return res.status(403).json({ message: "Unauthorized request" });
    }

    if (title) video.title = title;
    if (description) video.description = description;

    if (thumbnailFile) {
      const thumbnail = await uploadImage(thumbnailFile.path, `${req.user.username}/thumbnailurl`);
      video.thumbnail = thumbnail.secure_url;
    }

    await video.save();
    return res.status(200).json({ message: "Video updated successfully", video });

  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ message: "Unable to update video" });
  }
};

const DeleteVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (String(req.user?._id) !== String(video.owner)) {
      return res.status(403).json({ message: "Unauthorized request" });
    }

    await video.deleteOne();
    return res.status(200).json({ message: "Video deleted successfully" });

  } catch (error) {
    return res.status(500).json({ message: "Unable to delete video" });
  }
};

const watchVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    video.views += 1;
    await video.save();

    return res.status(200).json({ message: "Video view increased", views: video.views });
  } catch (error) {
    return res.status(500).json({ message: "Unable to increase video views" });
  }
};

export {
  publishaVideo,
  getAllVideos,
  getVideoById,
  updateVideo,
  DeleteVideo,
  watchVideo,
};
