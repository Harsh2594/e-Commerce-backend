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

    return res.status(200).json({
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

//view_product_by_id

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({
      success: false,
      message: "Invalid product ID",
      data: null,
      error: null,
    });
  }
  const product = await Product.findById(id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
      data: product,
      error: null,
    });
  }
  return res.status(200).json({
    success: true,
    message: "Product found successfully",
    data: product,
    error: null,
  });
};

//Product_search_By_keyword
exports.searchProduct = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Search keyword is required",
        data: null,
        error: null,
      });
    }
    const products = await Product.find({
      $or: [
        {
          name: {
            $regex: keyword,
            $options: "i",
          },
        },
        { description: { $regex: keyword, $options: "i" } },
        { cetegory: { $regex: keyword, $options: "i" } },
      ],
    });
    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      count: products.length,
      products,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Not able to fetch products",
      data: null,
      error: err.message,
    });
  }
};
