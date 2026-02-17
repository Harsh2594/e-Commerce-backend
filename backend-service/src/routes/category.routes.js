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

//Get_Categories
/**
 * @swagger
 * /api/category/getCategories:
 *   get:
 *     summary: Get all categories
 *     description: Fetch all active categories. Requires JWT authentication.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categories fetched successfully
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
 *                   example: Categories fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64cat123456
 *                       name:
 *                         type: string
 *                         example: Electronics
 *                       slug:
 *                         type: string
 *                         example: electronics
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: No categories found
 *       500:
 *         description: Server error
 */

router.get("/getCategories", verifyToken, categoryController.getCategories);

//Get Category_By_slug
/**
 * @swagger
 * /api/category/getCategory/{slug}:
 *   get:
 *     summary: Get category by slug
 *     description: Fetch a single active category using its slug. Requires JWT authentication.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category slug
 *     responses:
 *       200:
 *         description: Category found successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */

router.get(
  "/getCategory/:slug",
  verifyToken,
  categoryController.getCategoryBySlug,
);

//update Category
/**
 * @swagger
 * /api/category/updateCategory/{id}:
 *   put:
 *     summary: Update category
 *     description: Update category name and slug by category ID. Only admin users can perform this action.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
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
 *                 example: Electronics & Gadgets
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Category name is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */

router.put(
  "/updateCategory/:id",
  verifyToken,
  isAdmin,
  categoryController.updateCategory,
);

//Delete_Category
/**
 * @swagger
 * /api/category/deleteCategory/{id}:
 *   delete:
 *     summary: Delete category (soft delete)
 *     description: Soft delete a category by setting isActive to false. Only admin users can perform this action.
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       400:
 *         description: Category already deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */

router.delete(
  "/deleteCategory/:id",
  verifyToken,
  isAdmin,
  categoryController.deleteCategory,
);

module.exports = router;
