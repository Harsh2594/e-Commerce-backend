module.exports = (req, res, next) => {
  if (!req.user || req.user.role !== "user") {
    return res.status(403).json({
      success: false,
      message: "User access only",
      data: null,
      error: null,
    });
  }
  next();
};
