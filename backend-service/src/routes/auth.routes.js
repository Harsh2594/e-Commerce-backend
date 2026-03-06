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
 *                 example: User1@123
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
 *                 description: Password reset token received via email
 *                 example: "a3f5c2d1e4b6789012345678abcdef9012345678abcdef9012345678abcdef90"
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 description: New password for the account
 *                 example: "NewPass@1234"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *                 data:
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Validation or token error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                 data:
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   nullable: true
 *                   example: null
 *             examples:
 *               invalid_or_expired_token:
 *                 summary: Token is invalid or expired
 *                 value:
 *                   success: false
 *                   message: "Invalid or Expired token"
 *                   data: null
 *                   error: null
 *               validation_error:
 *                 summary: Mongoose validation failed (via handleError)
 *                 value:
 *                   success: false
 *                   message: "Path `newPassword` is required"
 *                   data: null
 *                   error: null
 *               invalid_id_format:
 *                 summary: Invalid ID format (via handleError)
 *                 value:
 *                   success: false
 *                   message: "Invalid ID format"
 *                   data: null
 *                   error: null
 *               duplicate_entry:
 *                 summary: Duplicate entry (via handleError)
 *                 value:
 *                   success: false
 *                   message: "Duplicate entry"
 *                   data: null
 *                   error: null
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 *                 data:
 *                   nullable: true
 *                   example: null
 *                 error:
 *                   type: string
 *                   nullable: true
 *                   description: Error detail shown only in non-production environments
 *                   example: null
 */
router.post("/resetPassword", validatePassword, authController.resetPassword);

module.exports = router;
