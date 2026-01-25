const mongoose = require("mongoose");
//wishlist_item_schema
const wishlistItem = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
});

//wishlist_Schema
const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, //create 1-1 relationship between wishlist and user
      ref: "User",
      required: true,
      unique: true,
    },
    items: [wishlistItem], //create M-N relationship between wishlist and product
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
