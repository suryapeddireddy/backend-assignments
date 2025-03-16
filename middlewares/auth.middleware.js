import User from "../models/user.models";
import jwt from 'jsonwebtoken';

const verifyJWT=async(req,res,next)=>{
try {
 const token=req.cookies?.accessToken;
 if(!token){
 return res.status(401).json({message:"Unauthorized request"});
 }   
 const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRE);
 const user=await User.findById(decoded.id);
 if(!user){
return res.status(400).json({message:"user not found"});
 }
 req.user=user; // we use this,so it can be used for logout and other purposes
 next();
} catch (error) {
 console.log("Error fetching tokens", error);
}
}