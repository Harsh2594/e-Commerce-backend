const mongoose = require("mongoose");

//product schema
const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  productImage: [{ type: String, required: false }],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  brand: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "inactive", "out of stock", "discontinued"],
    default: "active",
  },
  averageRating: {
    type: Number,
  },
  totalReview: {
    type: Number,
    default: 0,
  },
  likesCount: {
    type: Number,
    default: 0,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Product", productSchema);
