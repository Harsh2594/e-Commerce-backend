const Category = require("../models/category.model");

//Create_category
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
        data: null,
        error: null,
      });
    }
    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category exists",
        data: null,
        error: null,
      });
    }
    //Create slug
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    const category = await Category.create({
      name: name.trim(),
      slug,
      createdBy: req.user._id,
    });
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
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

//get all category
exports.getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({
      slug,
      isActive: true,
    });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null,
        error: null,
      });
    }
    return res.status(200).json({
      success: true,
      message: "category found",
      data: category,
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

//update Category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
        data: null,
        error: null,
      });
    }
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null,
        error: null,
      });
    }
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
    category.name = name.trim();
    category.slug = slug;
    await category.save();
    return res.status(200).json({
      success: true,
      message: "category updated successfully",
      category,
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

//delete Category(soft delete)
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: null,
        error: null,
      });
    }
    if (!category.isActive) {
      return res.status(400).json({
        success: false,
        message: "Category already deleted",
        data: null,
        error: null,
      });
    }
    category.isActive = false;
    await category.save();
    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: null,
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
