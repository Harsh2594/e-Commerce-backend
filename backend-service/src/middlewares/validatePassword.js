module.exports = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({
      success: true,
      message: "Password is required",
    });
  }
  const passwordregex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordregex.test(password)) {
    return res.status(400).json({
      success: true,
      message:
        "password must be at least 8 characters and include uppercase, lowercase,number,and special character",
      data: null,
      error: null,
    });
  }
  next();
};
