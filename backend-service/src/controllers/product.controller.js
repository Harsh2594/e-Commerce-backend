const Product = require("../models/product.model");
const Review = require("../models/review.model");
const Like = require("../models/like.model");

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
    return res.status(200).json({
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const totalProducts = await Product.countDocuments();
    const products = await Product.find().skip(skip).limit(limit);
    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      products,
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

//Product_Reviews_by_product_Id
exports.reviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findOne(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not found",
        data: null,
        error: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "Review find successfully",
      data: product.averageRating,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Not able to find review",
      data: null,
      error: err.message,
    });
  }
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

//filter_Products
exports.filterProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, brand } = req.query;
    let filter = {};
    if (category) {
      filter.category = category;
    }
    if (brand) {
      filter.brand = brand;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    const products = await Product.find(filter);
    return res.status(200).json({
      success: true,
      message: "Product filter successfully",
      count: products.length,
      products,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
      error: null,
    });
  }
};

//Product_status
exports.productStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowedStatus = [
      "active",
      "inactive",
      "out of stock",
      "discontinued",
    ];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product status",
        data: null,
        error: null,
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        data: null,
        error: null,
      });
    }
    product.status = status;
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product status updated successfully",
      data: null,
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

//Like_Product
exports.likeProduct = async (req, res) => {
  try {
    const userId = req.user.id;
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

    const alreadyLikes = await Like.findOne({
      user: userId,
      product: productId,
    });
    if (alreadyLikes) {
      await Like.findByIdAndDelete(alreadyLikes._id);
      if (product.likesCount > 1) {
        product.likesCount = product.likesCount - 1;
      } else {
        product.likesCount = 0;
      }
      await product.save();
      return res.status(200).json({
        success: true,
        message: "Product unliked",
        data: { likesCount: product.likesCount },
        error: null,
      });
    }

    await Like.create({
      user: userId,
      product: productId,
    });
    product.likesCount += 1;
    await product.save();
    return res.status(200).json({
      success: true,
      message: "Product liked",
      data: { likesCount: product.likesCount },
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to like product",
      data: null,
      error: err.message,
    });
  }
};

//Unlike_product
exports.unlikeProduct = async (req, res) => {
  try {
    const userId = req.user.id;
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

    const like = await Like.findOne({
      user: userId,
      product: productId,
    });
    if (!like) {
      return res.status(400).json({
        success: false,
        message: "Product is not liked yet",
        data: null,
        error: null,
      });
    }
    await Like.findByIdAndDelete(like._id);
    if (product.likesCount >= 1) product.likesCount = product.likesCount - 1;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product unliked",
      data: { likesCount: product.likesCount },
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to unlike product",
      data: null,
      error: err.message,
    });
  }
};

//get_like_count_id
exports.likesCount = async (req, res) => {
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
    return res.status(200).json({
      success: true,
      message: "Likes fetched successfully",
      data: {
        totalLikes: product.likesCount,
      },
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch likes",
      data: null,
      error: err.message,
    });
  }
};
