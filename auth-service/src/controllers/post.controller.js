const mongoose = require("mongoose");
const Post = require("../models/post.model");
const Product = require("../models/product.model");
const path = require("path");
const fs = require("fs");

//create_post

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { caption, taggedProductId } = req.body;

    //Validate image
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Post images is required",
        data: null,
        error: null,
      });
    }

    //Validate tagged product
    if (!taggedProductId) {
      return res.status(400).json({
        success: false,
        message: "Tagged product is required",
        data: null,
        error: null,
      });
    }

    if (!mongoose.Types.ObjectId.isValid(taggedProductId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid productId",
        data: null,
        error: null,
      });
    }

    const product = await Product.findById(taggedProductId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "product not found",
        data: null,
        error: null,
      });
    }

    //
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    //Create post
    const post = await Post.create({
      user: userId,
      caption: caption,
      imageUrl: imagePaths,
      taggedProduct: taggedProductId,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to create post",
      data: null,
      error: err.message,
    });
  }
};

//get_all_post
exports.getPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const posts = await Post.find({
      user: { $ne: new mongoose.Types.ObjectId(userId) },
    })
      .populate("user", "name")
      .populate("taggedProduct", "productName price productImage");
    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      data: null,
      error: err.message,
    });
  }
};
