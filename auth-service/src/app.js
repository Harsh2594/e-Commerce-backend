require("./config/db");
const express = require("express");

const app = express();

//Allows backend to read JSON request bodies
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/products", require("./routes/product.routes"));

const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

module.exports = app;
