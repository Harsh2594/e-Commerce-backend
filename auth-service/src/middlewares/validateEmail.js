module.exports = (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required!",
      data: null,
      error: null,
    });
  }
  if (typeof email !== "string") {
    return res.status(400).json({
      success: false,
      message: "Email should be a string",
      data: null,
      error: null,
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Email format",
      data: null,
      error: null,
    });
  }
  next();
};
