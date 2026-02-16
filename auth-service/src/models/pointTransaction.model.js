const mongoose = require("mongoose");

const pointTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["EARN", "REDEEM", "REDEEM_REFUND"],
    },
    source: {
      type: String,
      enum: ["POST_SALE", "ORDER_REDEEM", "ORDER_CANCEL"],
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("PointTransaction", pointTransactionSchema);
