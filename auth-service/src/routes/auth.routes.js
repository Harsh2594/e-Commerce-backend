/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

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
router.post("/signup", authController.signup);
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
router.post("/login", authController.login);
//logout
router.post("/logout", authController.logout);

module.exports = router;
