import User from "../models/user.models.js";
import { uploadImage } from "../utils/cloudinary.js";

const registerUser = async (req, res) => {
  // code to register user
  try {
    const { username, email, password, avatar } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const userExists = await User.find({$or:[{ email }, { username }]});
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const avatarlocalpath = req.file.path;
    if (!avatarlocalpath) {
      return res.status(400).json({ message: "Please upload an avatar" });
    }
    const avatarupload = await uploadImage(
      avatarlocalpath,
      `avatar/${username}`
    );
    if (!avatarupload) {
      return res.status(500).json({ message: "Failed to upload avatar" });
    }
    const user = new User({
      username,
      email,
      password,
      avatar: avatarupload.secure_url,
    });
    await user.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log("Failed to register User", error);
  }
};

export { registerUser };
