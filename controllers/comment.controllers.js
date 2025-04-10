import Comment from "../models/Comment.models.js";
import User from "../models/User.models.js";
import Video from "../models/Video.models.js";

// Get all comments for a video
const getAllComments = async (req, res) => {
  try {
    const { videoId } = req.params;

    const comments = await Comment.find({ video: videoId }).populate("owner", "username");
    return res.status(200).json({ message: "Comments fetched successfully", comments });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching comments", error: error.message });
  }
};

// Post a new comment
const postComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;
    const userId = req.user?._id;

    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const video = await Video.findById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const comment = new Comment({
      video: videoId,
      owner: userId,
      text,
      likes: 0,
    });

    video.comments += 1;

    await Promise.all([comment.save(), video.save()]);

    return res.status(201).json({ message: "Comment posted successfully", comment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error posting comment", error: error.message });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text } = req.body;
    const userId = req.user?._id;

    if (!text) return res.status(400).json({ message: "Updated text is required" });

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (String(comment.owner) !== String(userId)) {
      return res.status(403).json({ message: "Unauthorized to update this comment" });
    }

    comment.text = text;
    await comment.save();

    return res.status(200).json({ message: "Comment updated successfully", comment });
  } catch (error) {
    return res.status(500).json({ message: "Error updating comment", error: error.message });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?._id;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (String(comment.owner) !== String(userId)) {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    const video = await Video.findById(comment.video);
    if (video) {
      video.comments = Math.max(video.comments - 1, 0); // to avoid negative count
      await video.save();
    }

    await comment.deleteOne();

    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting comment", error: error.message });
  }
};

// Get comment by content, owner, and video
const getCommentById = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { text } = req.body;
    const { videoId } = req.params;

    if (!text) return res.status(400).json({ message: "Comment text is required" });

    const comment = await Comment.findOne({ owner: userId, text, video: videoId });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    return res.status(200).json({ message: "Comment found", comment });
  } catch (error) {
    return res.status(500).json({ message: "Error getting comment", error: error.message });
  }
};

export { getAllComments, postComment, updateComment, deleteComment, getCommentById };
