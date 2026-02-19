const mongoose = require("mongoose");
const generateUserId = require("../utils/generateCustomId");

const userSchema = new mongoose.Schema({
  publicId: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    trim: true,
  },
  address: {
    type: String,
    required: false,
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    immutable: true,
  },
  resetPasswordToken: {
    type: String,
  },

  resetPasswordExpires: {
    type: Date,
  },
  followerCount: {
    type: Number,
    default: 0,
  },
  followingCount: {
    type: Number,
    default: 0,
  },
  rewardPoints: {
    type: Number,
    default: 0,
  },
});

//use_pre_save_hook
userSchema.pre("save", async function () {
  if (!this.publicId) {
    const username = this.name.toLowerCase().replace(/[^a-z0-9]/g, "");
    this.publicId = await generateUserId(`user_${username}`, username);
  }
});

module.exports = mongoose.model("User", userSchema);
