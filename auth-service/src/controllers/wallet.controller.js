const pointTransactionModel = require("../models/pointTransaction.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const mongoose = require("mongoose");

//get_wellet_history
exports.getWalletHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const pointTransaction = await pointTransactionModel.find({ user: userId });
    if (pointTransaction.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No wellet history found",
        data: null,
        error: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Wellet history found successfully",
      data: pointTransaction,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to find Transaction",
      data: null,
      error: err.message,
    });
  }
};

//get_wallet_balance
exports.getWalletbalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("rewardPoints");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        error: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Wallet balance fetched successfully",
      data: {
        balance: user.rewardPoints,
      },
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wallet balance",
      data: null,
      error: err.message,
    });
  }
};

//Get_Wallet_Summary
exports.getWalletSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const summary = await pointTransactionModel.aggregate([
      {
        $match: { user: new mongoose.Types.ObjectId(req.user._id) },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$points" },
        },
      },
    ]);
    let totalEarned = 0;
    let totalRedeemed = 0;
    let totalRefunded = 0;

    summary.forEach((item) => {
      if (item._id === "EARN") {
        totalEarned = item.total;
      }
      if (item._id === "REDEEM") {
        totalRedeemed = item.total;
      }
      if (item._id === "REDEEM_REFUND") {
        totalRefunded = item.total;
      }
    });
    const user = await User.findById(userId).select("rewardPoints");
    return res.status(200).json({
      success: true,
      message: "wallet summary find successfully",
      data: {
        totalEarned,
        totalRedeemed,
        totalRefunded,
        currentBalance: user.rewardPoints || 0,
      },
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch wallet summary",
      data: null,
      error: err.message,
    });
  }
};
