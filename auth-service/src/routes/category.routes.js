/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category Management APIs
 */

const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

//Create_Cateory
/**
 * @swagger
 * /api/category/categories:
 *   post:
 *     summary: Create a new category
 *     description: Create a new product category. Only admin users can perform this action.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Category name is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       409:
 *         description: Category already exists
 *       500:
 *         description: Server error
 */
router.post(
  "/categories",
  verifyToken,
  isAdmin,
  categoryController.createCategory,
);

module.exports = router;
