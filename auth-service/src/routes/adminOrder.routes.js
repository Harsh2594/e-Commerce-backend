/**
 * @swagger
 * tags:
 *   name: Admin Orders
 *   description: Admin Order Management APIs
 */

const express = require("express");
const router = express.Router();
const adminOrderController = require("../controllers/adminOrder.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

router.get("/orders", verifyToken, isAdmin, adminOrderController.getAllOrders);

router.put(
  "/orders/:orderId/status",
  verifyToken,
  isAdmin,
  adminOrderController.changeOrderStatus,
);

module.exports = router;
