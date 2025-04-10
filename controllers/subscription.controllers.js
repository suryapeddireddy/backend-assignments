import User from '../models/User.models.js'
import Subscription from '../models/Subscription.models.js'

const getUserSubscriptions = async (req, res) => {
  try {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const subscriptions = await Subscription.find({ user: userId }).populate('channel', 'username');
    return res.status(200).json({ message: "Successfully fetched subscriptions", subscriptions });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching subscriptions", error: error.message });
  }
};

const getChannelSubscribers = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await User.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const subscriptions = await Subscription.find({ channel: channelId }).populate('user', 'username email');
    return res.status(200).json({ message: "Subscribers fetched successfully", subscriptions });
  } catch (error) {
    return res.status(500).json({ message: "Unable to fetch subscribers", error: error.message });
  }
};

const handleSubscription = async (req, res) => {
  try {
    const { channelId } = req.params;
    const userId = req.user._id;

    const channel = await User.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isSubscribed = await Subscription.findOne({ user: userId, channel: channelId });
    if (isSubscribed) {
      const deleted = await Subscription.findByIdAndDelete(isSubscribed._id);
      if (!deleted) {
        return res.status(500).json({ message: "Couldn't delete the subscription" });
      }
      return res.status(200).json({ message: "Successfully unsubscribed" });
    }

    const newSubscription = new Subscription({ user: userId, channel: channelId });
    await newSubscription.save();

    return res.status(200).json({ message: "Successfully subscribed to the channel" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to toggle subscription", error: error.message });
  }
};

export { getUserSubscriptions, getChannelSubscribers, handleSubscription };
