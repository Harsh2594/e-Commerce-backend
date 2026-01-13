const Product = require("../models/product.model");

//Add_Product
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      data: null,
      error: err.message,
    });
  }
};

//Delete_Product

exports.delProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "product not found",
        data: null,
        error: null,
      });
    }
    await Product.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: null,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      data: null,
      error: err.message,
    });
  }
};

//Update_Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
        error: null,
      });
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update product!",
      data: null,
      error: err.message,
    });
  }
};

//View_Product

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      message: "Products find successfully",
      data: products,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "failed to fetch products",
      data: null,
      error: err.message,
    });
  }
};
