const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("User", userSchema);
