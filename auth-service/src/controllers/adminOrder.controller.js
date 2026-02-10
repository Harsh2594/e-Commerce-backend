const Product = require("../models/product.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const rewardService = require("../services/reward.service");
const PointsTransaction = require("../models/pointTransaction.model");

//getAllorders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "productName");
    return res.status(200).json({
      success: true,
      message: orders.length ? "orders found" : "No orders found",
      data: orders,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "server error",
      data: null,
      error: err.message,
    });
  }
};

//change order status
exports.changeOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    //find order
    const order = await Order.findById(orderId)
      .populate("user", "name email")
      .populate("items.product", "productName price");
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: [],
        error: null,
      });
    }
    order.orderStatus = orderStatus;
    if (order.orderStatus === "delivered") {
      await rewardService.creditRewardPoints(order);
      order.rewardProcessed = true;
    }
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "failed to update order status",
      data: null,
      error: err.message,
    });
  }
};
