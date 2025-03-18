import User from '../models/User.models.js';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const verifyJWT = async (req, res, next) => {
  try {
    // Try to get token from cookies or Authorization header (Bearer token)
    const token = req.cookies?.accessToken || req.headers['authorization']?.split(' ')[1];
    
    // If no token found, return a 401 error
    if (!token) {
      console.log("No token found in cookies or authorization header.");
      return res.status(401).json({ message: "Token not found. Please provide a valid token." });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Find the user by decoded ID
    const user = await User.findById(decoded.id);

    // If user not found, return a 400 error
    if (!user) {
      console.log("User not found for token ID:", decoded.id);
      return res.status(400).json({ message: "User not found for this token." });
    }

    // Attach the user object to the request for use in the next middleware or route handler
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log("Error while verifying token:", error);
    return res.status(401).json({ message: "Failed to authenticate token." });
  }
};

export default verifyJWT;
