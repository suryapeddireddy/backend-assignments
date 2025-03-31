import Tweet from "../models/tweet.models.js"

const createTweet=async(req,res)=>{
try {
const userId=req.user?._id;
const {content}=req.body;
if(!content){
return res.status(500).json({message:error.message});
}
const tweet=new Tweet({
content,owner:userId
})
await tweet.save();
 return res.status(202).json({message:"user is created"});   
} catch (error) {
 return res.status(500).json({message:error.message});   
}
}

const deleteTweet=async(req,res)=>{
try {
const {tweetId}=req.params;
const tweet=await Tweet.findById(tweetId);
if(!tweet){
return res.status(404).json({message:"not found tweet"});
} 
await tweet.deleteOne();  
return res.status(200).json({message:"tweet deleted"});
} catch (error) {
  return res.status(500).json({error:error.message});  
}
}

const getuserTweets=async(req,res)=>{
try {
const userId=req.user?._id;
const tweets=await Tweet.find({owner:userId});
return res.status(200).json(tweets);
} catch (error) {
 return res.status(500).json({message:error.message});   
}
}

const updateTweet=async(req,res)=>{
try {
const {tweetId}=req.params;
const {content}=req.body;
if(!content){
return res.status(500).json({message:"content field is empty"});
}
const tweet=await Tweet.findById(tweetId);
if(!tweet){
return res.status(404).json({message:"tweet not found"});
}
tweet.content=content;
await tweet.save();
return res.status(200).json({message:"updated tweet"});
} catch (error) {
return res.status(500).json({message:"Failed to update tweet", error:error.message});   
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