const mongoose = require("mongoose");

//product schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Product", productSchema);
