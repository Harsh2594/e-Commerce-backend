const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Post = require("../models/post.model");
const handleError = require("../utils/errorHandler");
//Cart_API

//Add_to_cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId is required",
        data: null,
        error: null,
      });
    }

    if (quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number",
        data: null,
        error: null,
      });
    }
    //check product
    const product = await Product.findById(productId);
    if (!product || product.status !== "active") {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
        error: null,
      });
    }
    //check product stock
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item available in stock`,
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
      await cart.populate("items.product", "productName price");
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
    if (itemIndex === -1 && cart.items.length >= 50) {
      return res.status(400).json({
        success: false,
        message: "Cart limit reached. Maximum 50 different items allowed",
        data: null,
        error: null,
      });
    }
    // Update quantity if item exists
    if (itemIndex > -1) {
      const existingQuantity = cart.items[itemIndex].quantity;
      const totalQuantity = existingQuantity + quantity;
      // Check combined quantity
      if (totalQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `can not add ${quantity} item`,
          data: null,
          error: null,
        });
      }
      cart.items[itemIndex].quantity = totalQuantity;
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
    return handleError(res, err, "addToCart");
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
    return handleError(res, err, "getCart");
  }
};
//Update_cart
exports.updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    //find product
    const product = await Product.findById(productId);
    if (!product || product.status !== "active") {
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
        items: null,
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
  } catch (err) {
    return handleError(res, err, "updateCart");
  }
};
//Delete_cart_item
exports.removeProduct = async (req, res) => {
  try {
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
  } catch (err) {
    return handleError(res, err, "removeProduct");
  }
};

//Add_to_cart_from post
exports.addToCartFromPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { postId, quantity = 1 } = req.body;

    const post = await Post.findById(postId);
    //find_post
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "post not found",
        data: null,
        error: null,
      });
    }
    //find_product
    const product = await Product.findById(post.taggedProduct);
    if (!product || product.status !== "active") {
      return res.status(404).json({
        success: false,
        message: "Product not available",
        data: null,
        error: null,
      });
    }
    //check product stock
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} item available in stock`,
        data: null,
        error: null,
      });
    }
    //find_user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [
          {
            product: product._id,
            quantity: quantity,
            price: product.price,
            sourcePost: postId,
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
      (item) => item.product.toString() === product._id.toString(),
    );
    if (itemIndex === -1 && cart.items.length >= 50) {
      return res.status(400).json({
        success: false,
        message: "Cart limit reached. Maximum 50 different items allowed",
        data: null,
        error: null,
      });
    }
    if (itemIndex > -1) {
      const existingQuantity = cart.items[itemIndex].quantity;
      const totalQuantity = existingQuantity + quantity;
      // Check combined quantity
      if (totalQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `can not add ${quantity} item`,
          data: null,
          error: null,
        });
      }
      cart.items[itemIndex].quantity = totalQuantity;
    } else {
      cart.items.push({
        product: product._id,
        quantity: quantity,
        price: product.price,
        sourcePost: postId,
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
    return handleError(res, err, "addToCartFromPost");
  }
};
