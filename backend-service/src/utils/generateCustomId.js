const Counter = require("../models/counter.model");

const generateCustomId = async (name, prefix) => {
  const counter = await Counter.findOneAndUpdate(
    { name: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );
  return `${prefix}-${String(counter.seq).padStart(4, "0")}`;
};

module.exports = generateCustomId;
