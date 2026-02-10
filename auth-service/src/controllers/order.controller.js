const Product = require("../models/product.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");

// POST /api/orders/create
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentMethod, shippingAddress } = req.body;
    //find user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    //if cart empty
    if (!cart || cart.items.length == 0) {
      return res.status(200).json({
        success: true,
        message: "Cart is Empty",
        data: [],
        error: null,
      });
    }
    //build order items
    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
      if (!item.product || item.product.status !== "active") {
        throw new Error("Product unavailable");
      }
      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;
      return {
        product: item.product._id,
        price: item.product.price,
        quantity: item.quantity,
        sourcePost: item.sourcePost || null,
      };
    });

    //create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      shippingAddress,
      status: "pending",
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
      "name price images",
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
    // const userId = req.user.id;
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
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
