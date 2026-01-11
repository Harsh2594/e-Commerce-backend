const Product = require("../models/product.model");

//Add_Product
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({
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
        message: "product not found",
      });
    }
    await Product.findByIdAndDelete(id);
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
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
        message: "Product not found",
      });
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

//View_Product

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
