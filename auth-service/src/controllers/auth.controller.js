const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const crypto = require("crypto");
const { error } = require("console");

//signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Ragistered User" });
    }
    //hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    //createUser
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    res.status(201).json({
      success: true,
      message: "User ragistered successfully",
      data: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "signup failed",
      data: null,
      error: err.message,
    });
  }
};

//login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid user or password",
        data: null,
        error: null,
      });
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid user or password",
        data: null,
        error: null,
      });
    }

    //generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      env.jwtSecret,
      { expiresIn: "2d" }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Login Failed",
      data: null,
      err: err.message,
    });
  }
};

//logout
exports.logout = async (req, res) => {
  res.json({
    success: true,
    message: "Logout successfull.",
    data: null,
    error: null,
  });
};

//Forgot_password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
        error: null,
      });
    }
    //generate reset token
    const resetToken = jwt.sign({ id: user._id }, env.jwtSecret, {
      expiresIn: "10m",
    });
    console.log(resetToken);
    //hash token for saving in DB
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    //save this token to DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    //generate reset token

    //create reset link
    const resetLink = `http://localhost:${env.port}/resetPassword?token=${resetToken}`;
    // console.log("Reset link:", resetLink);

    return res.status(200).json({
      success: true,
      message: "Link has been sent to your email",
      data: { resetToken, link: resetLink },
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      data: null,
      error: err.message,
    });
  }
};

//reset_Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    //hash incoming token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    //Find valid user
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or Expired token ",
        data: null,
        error: null,
      });
    }
    //hashed new password and save
    user.password = await bcrypt.hash(newPassword, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      data: null,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error!",
      data: null,
      error: null,
    });
  }
};
