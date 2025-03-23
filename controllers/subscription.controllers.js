import User from '../models/User.models.js'
import Subscription from '../models/Subscription.models.js'

const getUserSubscriptions=async(req,res)=>{
try {
const userId=req.user?._id;
const user=await User.findById(userId);
if(!user){
return res.status(404).json({message:"User not found"});
}
const subcriptions=await Subscription.find({user:userId}).populate('channel', 'username');
return res.status(200).json({message:"successfully fetched subscriptions", subcriptions});
} catch (error) {
return res.status(501).json({message:"Error fetching subscriptions", error});
}
}

const getChannelSubscribers=async(req,res)=>{
try {
const {channelId}=req.params;
const channel=await User.findById(channelId);
if(!channel){
return res.status(401).json({message:"channel not found"});
}
const subscriptions=await Subscription.find({channel:channelId}).populate('user','username email');
return res.status(200).json({message:"subscribers fetched successfully", subscriptions});
} catch (error) {
  return res.status(501).json({message:"Unable to fetch subscribers",error});  
}
}

const handleSubscription = async (req, res) => {
    try {
      const { channelId } = req.params;
      const userId = req.user._id;
  
      // Check if the channel exists
      const channel = await User.findById(channelId);
      if (!channel) {
        return res.status(401).json({ message: "Channel Not found" });
      }
  
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
  
      // Check if the user is already subscribed to the channel
      const isChannelSubscribed = await Subscription.findOne({ user: userId, channel: channelId });
      if (isChannelSubscribed) {
        // If the user is already subscribed, delete the subscription
        const deleteSubscription = await Subscription.findByIdAndDelete(isChannelSubscribed._id);
        if (!deleteSubscription) {
          return res.status(501).json({ message: "Couldn't delete the subscription" });
        }
        return res.status(200).json({ message: "Successfully deleted the subscription" });
      }
  
      // If the user is not subscribed, create a new subscription
      const newSubscription = new Subscription({
        user: userId,
        channel: channelId,
      });
  
      // Save the new subscription
      await newSubscription.save();
  
      return res.status(200).json({ message: "Successfully subscribed to the channel" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to toggle subscription" ,error});
    }
  };
  
export {getUserSubscriptions, getChannelSubscribers, handleSubscription};