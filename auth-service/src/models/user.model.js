const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  _id: ObjectId,
  name: String,
  email: String,
  password: String,
  role: String,
});

module.exports = mongoose.model("user.model", usersSchema);
