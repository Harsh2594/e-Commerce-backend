const Product = require("../models/product.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const pointTransactionModel = require("../models/pointTransaction.model");
const generateCustomId = require("../utils/generateCustomId");
const REWARD = 0.01;

//restoreStock_helper
const restoreStock = async (decrementedProducts) => {
  for (const { productId, quantity } of decrementedProducts) {
    await Product.findByIdAndUpdate(productId, {
      $inc: { stock: quantity },
    });
  }
};

// POST /api/orders/create
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethod, shippingAddress } = req.body;
    //validate payment method
    const allowedPaymentMethods = ["COD", "CARD", "UPI"];
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
        data: null,
        error: null,
      });
    }
    if (!allowedPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment method. Allowed values: ${allowedPaymentMethods.join(", ")}`,
        data: null,
        error: null,
      });
    }
    //validate address
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
        data: null,
        error: null,
      });
    }
    const user = await User.findById(userId);
    //find user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    //if cart empty
    if (!cart || cart.items.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is Empty",
        data: [],
        error: null,
      });
    }
    //stock_check+decrement stcok before order creation
    const decrementedProducts = [];
    const orderItems = [];
    let totalAmount = 0;
    for (const item of cart.items) {
      if (!item.product || item.product.status !== "active") {
        await restoreStock(decrementedProducts);
        return res.status(400).json({
          success: false,
          message: `Product "${item.product.productName || "unknown"}" is unavailable`,
          data: null,
          error: null,
        });
      }
      const updatedProduct = await Product.findByIdAndUpdate(
        {
          _id: item.product._id,
          stock: { $gte: item.quantity },
        },
        {
          $inc: { stock: -item.quantity },
        },
        { new: true },
      );
      //null means stock was insufficient
      if (!updatedProduct) {
        await restoreStock(decrementedProducts);
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.product.productName}"`,
          data: null,
          error: null,
        });
      }
      decrementedProducts.push({
        productId: item.product._id,
        quantity: item.quantity,
      });
      //build order
      totalAmount += item.product.price * item.quantity;
      orderItems.push({
        product: item.product._id,
        price: item.product.price,
        quantity: item.quantity,
        sourcePost: item.sourcePost || null,
      });
    }

    //calculate redeem point accoding to order
    let redeemPoints = 0;
    let finalAmount = totalAmount;
    if (user.rewardPoints > 0) {
      const maxAllowedRedeem = totalAmount * 0.1;
      redeemPoints = Math.min(user.rewardPoints, maxAllowedRedeem);
      redeemPoints = Math.floor(redeemPoints);
      finalAmount = totalAmount - redeemPoints;
    }
    //create order
    const publicId = await generateCustomId("order", "ORD");
    const order = await Order.create({
      publicId,
      user: userId,
      items: orderItems,
      totalAmount,
      redeemedPoints: redeemPoints,
      finalAmount: finalAmount,
      paymentMethod,
      paymentStatus: "pending",
      shippingAddress,
      orderStatus: "pending",
    });

    //clear cart
    cart.items = [];
    await cart.save();
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
      data: null,
      error: err.message,
    });
  }
};

// GET  /api/orders/my-orders
exports.getOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId }).populate(
      "items.product",
      "productName price images",
    );
    if (!orders || orders.length == 0) {
      return res.status(200).json({
        success: true,
        message: "No orders found",
        data: [],
        error: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Orders found",
      data: orders,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      data: null,
      error: err.message,
    });
  }
};

// GET /api/orders/{id}
exports.getOrdersById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
        data: [],
        error: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Orders found",
      data: order,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      data: null,
      error: err.message,
    });
  }
};

//cancel_order
exports.cancelOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, user: userId });
    //find order
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
        error: null,
      });
    }
    if (order.orderStatus === "shipped" || order.orderStatus === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Order can not be canceled",
        data: null,
        error: null,
      });
    }
    if (order.redeemedPoints > 0 && order.rewardDeducted) {
      await User.findByIdAndUpdate(order.user, {
        $inc: { rewardPoints: order.redeemedPoints },
      });

      await pointTransactionModel.create({
        user: order.user,
        points: order.redeemedPoints,
        type: "REDEEM_REFUND",
        source: "ORDER_CANCEL",
        referenceId: order._id,
      });

      order.rewardDeducted = false;
    }
    order.orderStatus = "cancelled";
    order.paymentStatus = "refunded";

    await order.save();
    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Cancel failed",
      error: err.message,
    });
  }
};

//Return_order
exports.returnOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderId } = req.params;
    const order = await Order.findOne({ _id: orderId, user: userId }).populate({
      path: "items.sourcePost",
      populate: {
        path: "user",
        select: "_id name",
      },
    });

    //find order
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
        data: null,
        error: null,
      });
    }
    if (order.orderStatus !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "can not return product before delivery",
        data: null,
        error: null,
      });
    }
    //Restore redeemed points (if deducted)
    if (order.redeemedPoints > 0 && order.rewardDeducted) {
      await User.findByIdAndUpdate(order.user, {
        $inc: { rewardPoints: order.redeemedPoints },
      });
      await pointTransactionModel.create({
        user: order.user,
        points: order.redeemedPoints,
        type: "REDEEM_REFUND",
        source: "ORDER_RETURN",
        referenceId: order._id,
      });

      order.rewardDeducted = false;
    }
    //change source-post reward(jisko es post ki sale se reward mila hai uske rewardpoints update krne hain)
    if (order.rewardProcessed) {
      for (const item of order.items) {
        if (!item.sourcePost) {
          continue;
        }
        const postUser = item.sourcePost.user._id;
        const rewardPoints = Math.floor(item.price * item.quantity * REWARD);
        await User.findByIdAndUpdate(postUser, {
          $inc: { rewardPoints: -rewardPoints },
        });
        await pointTransactionModel.create({
          user: postUser,
          points: rewardPoints,
          type: "REWARD_REVERSAL",
          source: "ORDER_RETURN",
          referenceId: order._id,
        });
      }
      order.rewardProcessed = false;
    }
    order.orderStatus = "returned";
    order.paymentStatus = "refunded";
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Order returned successfully",
      data: order,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Return failed",
      data: null,
      error: err.message,
    });
  }
};
