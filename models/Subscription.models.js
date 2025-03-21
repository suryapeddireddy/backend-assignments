import mongoose from "mongoose";

const SubscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The user who is subscribing
      required: true,
    },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // The channel being subscribed to
      required: true,
    },
  },
  { timestamps: true } // Auto add createdAt & updatedAt timestamps
);

const Subscription = mongoose.model("Subscription", SubscriptionSchema);
export default Subscription;
