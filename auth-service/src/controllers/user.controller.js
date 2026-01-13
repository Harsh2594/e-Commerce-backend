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
