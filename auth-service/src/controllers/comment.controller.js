const mongoose = require("mongoose");
const Comment = require("../models/comment.model");
const Product = require("../models/product.model");

//Add comment
exports.addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, text } = req.body;
    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
        data: null,
        error: null,
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
        error: null,
      });
    }
    const comment = await Comment.create({
      user: userId,
      product: productId,
      text,
    });
    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
      data: null,
      error: err.message,
    });
  }
};

//Get_Comments
exports.getProductComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
        error: null,
      });
    }
    const comments = await Comment.find({ product: productId }).populate(
      "user",
      "name",
    );
    return res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: comments,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch comments",
      data: null,
      error: err.message,
    });
  }
};

//Delete_comment
exports.deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
        data: null,
        error: null,
      });
    }
    if (comment.user.toString !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
        data: null,
        error: null,
      });
    }
    await Comment.findByIdAndDelete(commentId);
    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: null,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      data: null,
      error: err.message,
    });
  }
};
