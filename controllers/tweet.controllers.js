import User from "../models/User.models.js"
import Tweet from "../models/tweet.models.js"

const createTweet=async(req,res)=>{
try {
    
} catch (error) {
    
}
}

const deleteTweet=async(req,res)=>{
try {
    
} catch (error) {
    
}
}

const getuserTweets=async(req,res)=>{
try {
    
} catch (error) {
    
}
}

const updateTweet=async(req,res)=>{
try {
  
} catch (error) {
    
}
}

const getTweetbyId=async(req,res)=>{
try {
const content=req.body;
const userId=req.user?._id;
const tweet=await Tweet.findOne({owner:userId,content});
if(!tweet){
return res.status(404).json({message:"Tweet not found"});
}
return res.status(200).json({tweet});
} catch (error) {
return res.status(500).json({message:error.message});   
}
}

export {createTweet,deleteTweet, getTweetbyId,getuserTweets,updateTweet};