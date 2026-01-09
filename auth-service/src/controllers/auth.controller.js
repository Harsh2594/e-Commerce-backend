const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

//signup

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Ragistered User" });
    }
    //hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    //createUser
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });
    res.status(201).json({
      message: "User ragistered successfully",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "signup failed" });
  }
};

//login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid user or password" });
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid user or password" });
    }

    //generate token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      env.jwtSecret,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login Failed", err });
  }
};
