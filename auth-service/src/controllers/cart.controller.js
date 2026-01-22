const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
//Cart_API

//Add_to_cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    //check product
    const product = await Product.findById(productId);
    if (!product || !product.status) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
        error: null,
      });
    }
    //find user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [
          {
            product: productId,
            quantity,
            price: product.price,
          },
        ],
        orderTotal: product.price * quantity,
      });
      await cart.save();
      return res.status(201).json({
        success: true,
        message: "Product added to cart",
        data: cart,
        error: null,
      });
    }
    //if cart exists
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
      });
    }
    //recalculate total order
    cart.orderTotal = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    await cart.save();
    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      data: null,
      error: err.message,
    });
  }
};
//Get_cart_items
exports.getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Your Cart is Empty",
        items: [],
        orderTotal: 0,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      items: cart.items,
      totalPrice: cart.orderTotal,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
      error: err.message,
    });
  }
};
//Update_cart
exports.updateCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  //find product
  const product = await Product.findById(productId);
  if (!product || !product.status) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
      data: null,
      error: null,
    });
  }
  //find cart
  const cart = await Cart.findOne({ user: userId });
  //if there is no cart or empty cart
  if (!cart || cart.items.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Nothing to update",
      items: cart.items,
      error: null,
    });
  }
  //if cart exists
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }
  //recalculate total order
  cart.orderTotal = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  await cart.save();
  return res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cart,
    error: null,
  });
};
//Delete_cart_item
exports.removeProduct = async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;
  //find cart
  const cart = await Cart.findOne({ user: userId });
  if (!cart || cart.items.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Your Cart is empty",
      data: null,
      error: null,
    });
  }
  //find index of item
  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );
  //remove item from cart
  if (itemIndex > -1) {
    cart.items.splice(itemIndex, 1);
  }
  //recalculate total order
  cart.orderTotal = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  await cart.save();
  return res.status(200).json({
    success: true,
    message: "item removed from cart",
    data: cart,
    error: null,
  });
};
