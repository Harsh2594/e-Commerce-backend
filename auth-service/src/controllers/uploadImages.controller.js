const Product = require("../models/product.model");
const path = require("path");
const fs = require("fs");

//upload_Images

exports.uploadImages = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
        data: null,
        error: null,
      });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Images not uploaded",
        data: null,
        error: null,
      });
    }

    // convert files → image paths
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    // attach images to product
    const product = await Product.findByIdAndUpdate(
      productId,
      {
        $push: { productImage: { $each: imagePaths } },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      files: req.files,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to upload images",
      data: null,
      error: err.message,
    });
  }
};

//Update_Image

exports.updateImages = async (req, res) => {
  try {
    // console.log(req.params);
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Product id not found",
        data: null,
        error: null,
      });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded",
        data: null,
        error: null,
      });
    }
    const product = await Product.findById(id);
    console.log(product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
        error: null,
      });
    }

    //delete old product images
    if (product.productImage && product.productImage.length > 0) {
      product.productImage.forEach((imgpath) => {
        if (!imgpath) return;
        const fullPath = path.join(__dirname, "..", "..", imgpath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      });
    }
    //save new images path
    const newImages = req.files
      .map((file) => {
        return `/uploads/${file.filename}`;
      })
      .filter(Boolean);

    product.productImage = newImages;
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product images updated successfully",
      data: product,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to update product images",
      data: null,
      error: err.message,
    });
  }
};
