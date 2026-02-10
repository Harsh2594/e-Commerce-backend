const { default: mongoose } = require("mongoose");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Post = require("../models/post.model");
const PointTransactionModel = require("../models/pointTransaction.model");
const REWARD = 0.01;

exports.creditRewardPoints = async (order) => {
  try {
    if (!order || !order.items.length === 0) {
      return;
    }
    if (order.rewardProcessed) {
      return;
    }
    for (const item of order.items) {
      if (!item.sourcePost) {
        continue;
      }
      const post = await Post.findById(item.sourcePost);
      if (!post) {
        continue;
      }
      const postUserId = post.user;
      //ignore self purchase reward
      if (postUserId.toString() === order.user.toString()) {
        continue;
      }

      //calculate reward
      const rewardPoints = Math.floor(item.price * item.quantity * REWARD);
      await User.findByIdAndUpdate(postUserId, {
        $inc: { rewardPoints: rewardPoints },
      });
      await PointTransactionModel.create({
        user: postUserId,
        points: rewardPoints,
        type: "EARN",
        source: "POST_SALE",
        referenceId: order._id,
      });
    }
  } catch (err) {
    console.error("Reward creation failed:", err.message);
    throw err;
  }
};
