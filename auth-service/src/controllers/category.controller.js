const Category = require("../models/category.model");

//Create_category
exports.createCategory = async (req, res) => {
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
};

//
