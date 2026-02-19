const Counter = require("../models/counter.model");

const generateUserId = async (counterName, prefix) => {
  const counter = await Counter.findOneAndUpdate(
    { name: counterName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return `${prefix}${String(counter.seq).padStart(3, "0")}`;
};

module.exports = generateUserId;
