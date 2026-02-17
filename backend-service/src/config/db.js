const mongoose = require("mongoose");
const env = require("./env");

mongoose
  .connect(env.dbUrl) // ecommerce_DB will be created automatically if not exists.
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });
