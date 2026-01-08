const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  _id: ObjectId,
  name: String,
  price: String,
  description: String,
  createdBy: String,
});

module.exports = mongoose.model("product.model", productSchema);
