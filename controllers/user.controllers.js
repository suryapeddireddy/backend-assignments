import User from '../models/User.models.js';
import { uploadImage } from "../utils/cloudinary.js";

// Register User
const registerUser = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Trim and convert username and email to lowercase
    username = username.trim().toLowerCase();
    email = email.trim().toLowerCase();

    console.log(username, email, password);

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
    const avatarupload = await uploadImage(
      avatarlocalpath,
      `avatar/${username}`
    );
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
    if (error.code === 11000) {
      return res.status(400).json({ message: "Username or Email already exists" });
    }

    console.log("Failed to register User", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};


const getAccessAndRefreshTokens = async (Userid) => {
  try {
    const user = await User.findById(Userid);
    const accessToken = await user.generateAccessToken(); // Corrected to generate access token
    const refreshToken = await user.generateRefreshToken(); // Corrected to generate refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Unable to fetch Tokens", error);
  }
};

// Login User
const LoginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!(email || username) || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const UserExists = await User.findOne({ $or: [{ email }, { username }] }).select("+password");
    if (!UserExists) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const PasswordMatch = await UserExists.isPasswordCorrect(password);
    if (!PasswordMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    const { accessToken, refreshToken } = await getAccessAndRefreshTokens(UserExists._id);
    const LoggedinUser = await User.findById(UserExists._id);
    const options = {
      httpOnly: true,
      secure: false, // Ensure secure cookie in production
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "User successfully logged in",
        LoggedinUser,
        refreshToken,
      });
  } catch (error) {
    console.log("Failed to login User", error);
    return res.status(401).json({ message: "Failed to login", error: error });
  }
};

// Logout User
const LogoutUser = async (req, res) => {
  try {
    const user = req.user;
    await User.findByIdAndUpdate(user.id, { refreshToken: "" }, { new: true });
    return res
      .status(200)
      .clearCookie("accessToken") // Corrected to `clearCookie`
      .clearCookie("refreshToken") // Corrected to `clearCookie`
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.log("Error logging out User", error);
    return res.status(500).json({ message: "Error logging out" });
  }
};

export { registerUser, LoginUser, LogoutUser };
