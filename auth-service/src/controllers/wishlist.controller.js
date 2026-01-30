const Product = require("../models/product.model");
const User = require("../models/user.model");
const Wishlist = require("../models/wishlist.model");

//Add_to_wishlist

exports.addToWishlist = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;
  //check_product
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
      data: null,
      error: null,
    });
  }
  //find user wishlist
  let wishlist = await Wishlist.findOne({ user: userId });
  //if wishlist not exsits create
  if (!wishlist) {
    wishlist = new Wishlist({
      user: userId,
      items: [
        {
          product: productId,
        },
      ],
    });
  }
  await wishlist.save();
  return res.status(201).json({
    success: true,
    message: "product wishlisted",
    wishlist,
    error: null,
  });
  //wishlist exists check product in wishlist
  const productExists = wishlist.items.some(
    (item) => item.product.toString() === productId,
  );
  if (productExists) {
    return res.status(409).json({
      success: false,
      message: "product already in wishlist",
      data: null,
      error: null,
    });
  }
  //add product if product not exists in wishlist
  wishlist.items.push({ product: productId });
  await wishlist.save();
  return res.status(200).json({
    success: true,
    message: "product added to wishlist",
    data: wishlist,
    error: null,
  });
};

//Get_Wishlist

exports.getWishlist = async (req, res) => {
  const userId = req.user.id;
  const wishlist = await Wishlist.findOne({ user: userId }).populate({
    path: "items.product",
    select: "productName price status",
  });
  if (!wishlist || wishlist.items.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Your wishlist is Empty",
      items: [],
      error: null,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Wishlist fetched successfully",
    items: wishlist.items,
    error: null,
  });
};

//Remove_from_wishlist

exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    //find wishlist
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist || wishlist.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Your wishlist is empty",
        data: null,
        error: null,
      });
    }
    //find product in wishlist
    const itemIndex = wishlist.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product is not in wishlist",
        data: null,
        error: null,
      });
    }
    //if product exists in wishlist remove
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      data: wishlist,
      error: null,
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
