const mongoose = require("mongoose");
const Follow = require("../models/follow.model");
const User = require("../models/user.model");

exports.clickFollow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { followingId } = req.params;

    //can not follow yourself
    if (followerId === followingId) {
      return res.status(400).json({
        success: false,
        message: "Can not follows yourself",
        data: null,
        error: null,
      });
    }

    //find user
    const userToFollow = await User.findById(followingId);
    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        error: null,
      });
    }

    const existingFollow = await Follow.findOne({
      follower: followerId,
      following: followingId,
    });
    //Unfollow
    if (existingFollow) {
      await Follow.findByIdAndDelete(existingFollow._id);
      await User.findByIdAndUpdate(followerId, {
        $inc: { followingCount: -1 },
      });
      await User.findByIdAndUpdate(followingId, {
        $inc: { followerCount: -1 },
      });

      return res.status(200).json({
        success: true,
        message: "User unfollow",
        data: null,
        error: null,
      });
    }
    //follow
    await Follow.create({
      follower: followerId,
      following: followingId,
    });

    await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
    await User.findByIdAndUpdate(followingId, { $inc: { followerCount: 1 } });

    return res.status(200).json({
      success: true,
      message: "User followed",
      data: null,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to follow/unfollow",
      data: null,
      error: err.message,
    });
  }
};
