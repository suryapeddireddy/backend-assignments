import Video from "../models/Video.models.js";
import PlayList from "../models/playlist.models.js";

// Add a video to a playlist
const AddVideotoPlayList = async (req, res) => {
  try {
    const { videoId, playListId } = req.params;

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const playlist = await PlayList.findById(playListId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    // Avoid duplicate addition
    if (playlist.videos.includes(videoId)) {
      return res.status(400).json({ message: "Video already in playlist" });
    }

    playlist.videos.push(videoId);
    await playlist.save();

    return res.status(200).json({ message: "Video added to playlist successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error adding video to playlist", error: error.message });
  }
};

// Remove a video from a playlist
const RemoveVideofromPlayList = async (req, res) => {
  try {
    const { videoId, playListId } = req.params;

    const playlist = await PlayList.findById(playListId);
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const index = playlist.videos.indexOf(videoId);
    if (index === -1) {
      return res.status(404).json({ message: "Video not found in playlist" });
    }

    playlist.videos.splice(index, 1);
    await playlist.save();

    return res.status(200).json({ message: "Video removed from playlist successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error removing video from playlist", error: error.message });
  }
};

// Create a new playlist
const CreatePlayList = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?._id;

    const playlist = new PlayList({
      name,
      description,
      owner: userId,
    });

    await playlist.save();
    return res.status(201).json({ message: "Playlist created successfully", playlist });
  } catch (error) {
    return res.status(500).json({ message: "Error creating playlist", error: error.message });
  }
};

// Update an existing playlist
const UpdatePlayList = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { playListId } = req.params;
    const userId = req.user?._id;

    const playlist = await PlayList.findOneAndUpdate(
      { _id: playListId, owner: userId },
      { name, description },
      { new: true }
    );

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    return res.status(200).json({ message: "Playlist updated successfully", playlist });
  } catch (error) {
    return res.status(500).json({ message: "Error updating playlist", error: error.message });
  }
};

// Delete a playlist
const DeletePlayList = async (req, res) => {
  try {
    const { playListId } = req.params;
    const playlist = await PlayList.findByIdAndDelete(playListId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    return res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting playlist", error: error.message });
  }
};

// Get a specific playlist by name & description (owned by user)
const GetPlayListById = async (req, res) => {
  try {
    const { name, description } = req.body;
    const userId = req.user?._id;

    const playlist = await PlayList.findOne({ name, description, owner: userId });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    return res.status(200).json({ message: "Playlist found", playlist });
  } catch (error) {
    return res.status(500).json({ message: "Error getting playlist", error: error.message });
  }
};

// Get all playlists by a user
const GetUserPlayLists = async (req, res) => {
  try {
    const { userId } = req.params;

    const playlists = await PlayList.find({ owner: userId });

    return res.status(200).json({ message: "Playlists found", playlists });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching user playlists", error: error.message });
  }
};

export {
  AddVideotoPlayList,
  RemoveVideofromPlayList,
  CreatePlayList,
  UpdatePlayList,
  DeletePlayList,
  GetPlayListById,
  GetUserPlayLists,
};
