const mongoose = require("mongoose");

//payment Schema
const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["success", "failed", "pending", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      default: "Mock",
    },
    transactionId: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Payment", paymentSchema);
