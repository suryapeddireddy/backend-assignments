import User from "../models/user.models.js";
import { uploadImage } from "../utils/cloudinary.js";

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate that all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Check if user with this email or username already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if avatar is uploaded
    const avatarlocalpath = req.file ? req.file.path : null;
    if (!avatarlocalpath) {
      return res.status(400).json({ message: "Please upload an avatar" });
    }

    // Upload avatar image to Cloudinary
    const avatarupload = await uploadImage(avatarlocalpath, `avatar/${username}`);
    if (!avatarupload) {
      return res.status(500).json({ message: "Failed to upload avatar" });
    }

    // Create a new user object
    const user = new User({
      username,
      email,
      password,
      avatar: avatarupload.secure_url,
    });

    // Save user to the database
    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("Failed to register User", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export { registerUser };
