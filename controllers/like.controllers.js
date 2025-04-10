import Like from "../models/Like.models.js";
import Video from "../models/Video.models.js";
import User from "../models/User.models.js";
import Comment from "../models/Comment.models.js";

// Toggle like for a video
const toggleVideoLike = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user?._id;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const existingLike = await Like.findOne({ owner: userId, video: videoId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      video.likes = Math.max(0, video.likes - 1); // Ensure it doesn't go negative
      await video.save();
      return res.status(200).json({ message: "Video like removed" });
    }

    await new Like({ owner: userId, video: videoId }).save();
    video.likes += 1;
    await video.save();

    return res.status(200).json({ message: "Video liked successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error toggling video like", error: error.message });
  }
};

// Toggle like for a comment
const toggleCommentLike = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?._id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const existingLike = await Like.findOne({ owner: userId, comment: commentId });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      comment.likes = Math.max(0, comment.likes - 1);
      await comment.save();
      return res.status(200).json({ message: "Comment like removed" });
    }

    await new Like({ owner: userId, comment: commentId }).save();
    comment.likes += 1;
    await comment.save();

    return res.status(200).json({ message: "Comment liked successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error toggling comment like", error: error.message });
  }
};

// Get all videos liked by the user
const getLikedVideos = async (req, res) => {
  try {
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const likedVideos = await Like.find({ owner: userId, video: { $ne: null } })
      .populate("video");

    return res.status(200).json({
      message: "Liked videos fetched successfully",
      likedVideos: likedVideos.map(like => like.video),
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching liked videos", error: error.message });
  }
};

export { toggleCommentLike, toggleVideoLike, getLikedVideos };
