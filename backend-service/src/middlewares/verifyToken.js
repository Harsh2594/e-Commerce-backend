const jwt = require("jsonwebtoken");
const env = require("../config/env");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
        data: null,
        error: null,
      });
    }
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
        data: null,
        error: null,
      });
    }
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, env.jwtSecret);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
      data: null,
      error: err.message,
    });
  }
};
