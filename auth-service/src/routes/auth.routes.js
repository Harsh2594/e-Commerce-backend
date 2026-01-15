/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const validateEmail = require("../middlewares/validateEmail");
const verifyToken = require("../middlewares/verifyToken");
const loginValidation = require("../middlewares/loginValidation");
const validatePassword = require("../middlewares/validatePassword");

//signup
/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: user1
 *               email:
 *                 type: string
 *                 example: user1@test.com
 *               password:
 *                 type: string
 *                 example: user1t123
 *               role:
 *                 type: string
 *                 enum: [admin,user]
 *                 example: user
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post("/signup", validateEmail, validatePassword, authController.signup);
//login
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginValidation, authController.login);
//logout
router.post("/logout", authController.logout);
//Forgot_Password
/**
 * @swagger
 * /api/auth/forgotPassword:
 *   post:
 *     summary: Forgot Password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user1@gmail.com
 *     responses:
 *       200:
 *         description: Link has been sent to your email
 *       400:
 *         description: Email is required
 *       404:
 *         description: User not found
 *
 */
router.post("/forgotPassword", validateEmail, authController.forgotPassword);
//Reset_password
/**
 * @swagger
 * /api/auth/resetPassword:
 *   post:
 *     summary: Reset Password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: reset_token_here
 *               newPassword:
 *                 type: string
 *                 example: user1@123
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post("/resetPassword", authController.resetPassword);

module.exports = router;
