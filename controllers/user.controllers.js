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
    console.log("Failed to register User", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const getAcessandRefreshTokens = async (Userid) => {
  try {
    const user = await User.findById(Userid);
    const accessToken = await user.generateRefreshToken();
    const refreshToken = await user.generateAccessToken();
    user.refershToken = refreshToken;
    user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Unable to fetch Tokens", error);
  }
};
const LoginUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!(email || username) || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    const UserExists = await User.findOne({ $or: [{ email }, { username }] });
    if (!UserExists) {
      return res.status(400).json({ message: "User doesnt exist" });
    }
    const PasswordMatch = await UserExists.ispasswordCorrect(password);
    if (!PasswordMatch) {
      return res.status(400).json({ message: "Password is incorrect" });
    }
    const { accessToken, refreshToken } = await getAcessandRefreshTokens(
      UserExists._id
    );
    const LoggedinUser = await User.findById(UserExists._id).select(
      "-refreshToken"
    );
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "User successfully Loggedin",
        LoggedinUser,
        refreshToken,
      });
  } catch (error) {
    console.log("Failed to login User", error);
  }
};

const LogoutUser = async (req, res) => {
  try {
    const user = req.user;
    await User.findByIdAndUpdate(user.id, { refreshToken: "" }, { new: true });
    return res
      .status(200)
      .clearcookie("accessToken")
      .clearcookie("refreshToken")
      .json({ message: "user loggedout successfully" });
  } catch (error) {
    console.log("Error Loggingout User", error);
  }
};
export { registerUser };
