import Video from "../models/Video.js";
import Comment from "../models/Comment.models.js";

// Get all videos of a channel (user)
const getChannelVideos = async (req, res) => {
  try {
    const { channelId } = req.params;

    if (!channelId) {
      return res.status(400).json({ message: "Channel ID is required" });
    }

    const channelVideos = await Video.find({ owner: channelId });
    return res.status(200).json({ message: "Videos fetched successfully", channelVideos });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching channel videos", error: error.message });
  }
};

// Get all comments made by a user
const getAllUserComments = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found in request" });
    }

    const comments = await Comment.find({ owner: userId }).populate("video", "title");
    return res.status(200).json({ message: "User comments fetched successfully", comments });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user comments", error: error.message });
  }
};

export { getChannelVideos, getAllUserComments };
