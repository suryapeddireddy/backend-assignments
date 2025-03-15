import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true
  },
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
    select:false
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
  refershToken: {
    type: String,
    required: false,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

UserSchema.methods.ispasswordCorrect=async (password)=>{
return await bcrypt.compare(password,this.password);
}

UserSchema.methods.generateRefreshToken=async()=>{
 return jwt.sign({id:this._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:process
  .env.REFRESH_TOKEN_EXPIRY
 })
}
UserSchema.methods.generateAccessToken=async()=>{
return jwt.sign({id:this._id,username:this.username,email:this.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}

const User = mongoose.model("User", UserSchema);
export default User;
