const mongoose = require("mongoose");

//cart_item_schema
const cartItem = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  sourcePost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    default: null,
  },
});

//Cart_Schema
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItem],
    orderTotal: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// cartSchema.index({ user: 1 });

module.exports = mongoose.model("Cart", cartSchema);
