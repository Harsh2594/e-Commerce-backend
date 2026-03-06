const Order = require("../models/order.model");
const rewardService = require("../services/reward.service");

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
    //validate orderId
    if (!orderId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
        data: null,
        error: null,
      });
    }
    //Validate orderStatus is provided
    if (!orderStatus) {
      return res.status(400).json({
        success: false,
        message: "orderStatus is required",
        data: null,
        error: null,
      });
    }
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
    //prevent backward status transitions
    const STATUS_FLOW = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ];
    const currentIndex = STATUS_FLOW.indexOf(order.orderStatus);
    const newIndex = STATUS_FLOW.indexOf(orderStatus);
    const allowedBackward = ["cancelled", "returned"];
    if (newIndex < currentIndex && !allowedBackward.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `can not change status from ${order.orderStatus} to ${orderStatus}`,
        data: null,
        error: null,
      });
    }

    if (orderStatus === "delivered" && !order.rewardProcessed) {
      await rewardService.creditRewardPoints(order);
      order.rewardProcessed = true;
    }
    order.orderStatus = orderStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
      error: null,
    });
  } catch (err) {
    const isValidationError = err.name === "ValidationError";
    return res.status(isValidationError ? 400 : 500).json({
      success: false,
      message: isValidationError
        ? err.message
        : "failed to update order status",
      data: null,
      error: err.message,
    });
  }
};
