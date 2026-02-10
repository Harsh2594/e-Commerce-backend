require("./config/db");
const express = require("express");
const path = require("path");

const app = express();

//Allows backend to read JSON request bodies
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/products", require("./routes/product.routes"));

app.use("/api/users", require("./routes/user.routes"));

app.use("/api/uploads", require("./routes/upload.routes"));

app.use("/api/category", require("./routes/category.routes"));

app.use("/api/cart", require("./routes/cart.routes"));

app.use("/api/wishlist", require("./routes/wishlist.routes"));

app.use("/api/orders", require("./routes/order.routes"));

app.use("/api/admin", require("./routes/adminOrder.routes"));

app.use("/api/payment", require("./routes/payment.routes"));

app.use("/api/review", require("./routes/review.routes"));

app.use("/api/comment", require("./routes/review.routes"));

app.use("/api/follow", require("./routes/follow.routes"));

app.use("/api/posts", require("./routes/post.routes"));

const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

module.exports = app;
