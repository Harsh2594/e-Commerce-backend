const Product = require("../models/product.model");
const Review = require("../models/review.model");

//Add Review
exports.addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, rating, comment } = req.body;

    //find review
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });
    //if review found
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product",
        data: null,
        error: null,
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not found",
        data: null,
        error: null,
      });
    }
    //if review not found create first create it
    const review = await Review.create({
      user: userId,
      product: productId,
      rating: rating,
      comment: comment,
    });

    //change average rating of that product
    const totalReview = product.totalReview + 1;
    if (totalReview > 1) {
      const averageRating =
        (product.averageRating * product.totalReview + rating) / totalReview;
      product.averageRating = averageRating;
    } else {
      product.averageRating = rating;
    }
    product.totalReview = totalReview;

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Your review added successfully",
      review: review,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to add review",
      data: null,
      error: err.message,
    });
  }
};

//Delete Review (User) by_Id
exports.removeReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    //find review
    const review = await Review.findOne({ user: userId, product: productId });
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "You have not reviewed this product yet",
        data: null,
        error: null,
      });
    }

    //find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not found",
        data: null,
        error: null,
      });
    }

    //find review and delete
    await Review.findByIdAndDelete(review._id);

    //update ptoduct rating
    if (product.totalReview > 1) {
      const newtotalReview = product.totalReview - 1;
      product.averageRating =
        (product.averageRating * product.totalReview - review.rating) /
        newtotalReview;
    } else {
      product.totalReview = 0;
      product.averageRating = 0;
    }
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: null,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete review",
      data: null,
      error: err.message,
    });
  }
};

//get_product_review_by_id
exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product Not found",
        data: null,
        error: null,
      });
    }

    const reviews = await Review.find({ product: productId }).populate(
      "user",
      "name",
    );

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      data: {
        totalReviews: reviews.length,
        averageRating: product.averageRating,
        reviews,
      },
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews",
      data: null,
      error: err.message,
    });
  }
};
