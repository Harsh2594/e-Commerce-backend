require("dotenv").config();
const env = require("./config/env");
const app = require("./app");

app.listen(env.port, () => {
  console.log(`server running on port ${env.port}`);
});
