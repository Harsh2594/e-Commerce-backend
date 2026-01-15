const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const env = require("../config/env");

//Change_password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "old password or new password is required",
        data: null,
        error: null,
      });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "new password should not equal to old password",
        data: null,
        error: null,
      });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User Not found",
        data: null,
        error: null,
      });
    }
    //verfify old passwrod
    const isMatch = await bcrypt.compare(oldPassword, newPassword);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "old password is incorrect",
        data: null,
        error: null,
      });
    }
    //hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Password changed Successfully",
      data: null,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
      data: null,
      error: err.message,
    });
  }
};

//get_profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user not found",
        data: null,
        error: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "User found",
      data: { user },
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to get user details",
      data: null,
      error: err.message,
    });
  }
};

//update_profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedFields = ["name"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
        data: null,
        error: err.message,
      });
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user: updatedUser },
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
      error: err.message,
    });
  }
};
