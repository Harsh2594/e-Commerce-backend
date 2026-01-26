const Payment = require("../models/payment.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");

//mock_Payemnt_System

exports.mockPayment = async (req, res) => {
  const userId = req.user.id;
  const { orderId, paymentStatus } = req.body;

  //find order
  const order = await Order.findOne({ _id: orderId, user: userId }); //
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
      data: null,
      error: null,
    });
  }
  if (order.orderStatus !== "pending") {
    return res.status(400).json({
      success: false,
      message: "Order already processed",
      data: order,
      error: null,
    });
  }
  const payment = await Payment.create({
    user: userId,
    order: orderId,
    amount: order.totalAmount,
    paymentStatus: paymentStatus,
    transactionId: `SBI-${Date.now()}`,
  });

  if (paymentStatus === "success") {
    order.orderStatus = "confirmed";
    await order.save();
  }
  return res.status(200).json({
    success: true,
    message: "Payment processed",
    data: payment,
    error: null,
  });
};
