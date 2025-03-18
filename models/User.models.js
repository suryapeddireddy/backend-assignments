import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Exclude password by default
  },
  avatar: {
    type: String,
    required: true,
  },
  videos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  watchHistory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
  ],
  refreshToken: {
    type: String,
    default: null, // Use default instead of `required: false`
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

// 🔹 Hash password before saving user
UserSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// 🔹 Method to check if password is correct
UserSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔹 Generate Refresh Token
UserSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    { id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// 🔹 Generate Access Token
UserSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    { id: this._id }, // Only include the user ID to minimize exposure
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// 🔹 Clear Refresh Token (when user logs out or refresh token is invalidated)
UserSchema.methods.clearRefreshToken = async function () {
  this.refreshToken = null;
  await this.save();
};

const User = mongoose.model("User", UserSchema);
export default User;
