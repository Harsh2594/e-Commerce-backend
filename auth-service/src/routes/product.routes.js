/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product Management APIs
 */

const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

//Add_product
/**
 * @swagger
 * /api/products/add:
 *   post:
 *     summary: Add a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - price
 *               - description
 *             properties:
 *               productName:
 *                 type: string
 *                 example: iPhone 15
 *               price:
 *                 type: number
 *                 example: 79999
 *               description:
 *                 type: string
 *                 example: Latest Apple iPhone
 *               category:
 *                 type: string
 *                 description: Category ID (MongoDB ObjectId)
 *                 example: 66c9a8f2a9e3a7b9c1234567
 *               brand:
 *                 type: string
 *                 example: Apple
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post("/add", verifyToken, isAdmin, productController.addProduct);

//Update_Product
/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 example: iPhone 15 Pro
 *               price:
 *                 type: number
 *                 example: 89999
 *               description:
 *                 type: string
 *                 example: Updated product description
 *               category:
 *                 type: string
 *                 example: Electronics
 *               brand:
 *                 type: string
 *                 example: Apple
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
router.put("/:id", verifyToken, isAdmin, productController.updateProduct);

//Delete_Product
/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 */
router.delete("/:id", verifyToken, isAdmin, productController.delProduct);

//View_Product
/**
 * @swagger
 * /api/products/view:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number to fetch
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 5
 *         description: Number of products per page
 *         example: 5
 *     responses:
 *       200:
 *         description: Products fetched successfully
 */
router.get("/view", verifyToken, productController.getProducts);

//View_product_By_Id
/**
 * @swagger
 * /api/products/view/{id}:
 *   get:
 *     summary: Get Product By ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Products fetched successfully
 */
router.get("/view/:id", verifyToken, productController.getProductById);

//Product_search_By_keyword
/**
 * @swagger
 * /api/products/searchProducts:
 *   get:
 *     summary: Search products by keyword
 *     description: Search products using keyword in name, description, or category. Requires JWT authentication.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         required: true
 *         description: Keyword to search product by name, description, or category
 *     responses:
 *       200:
 *         description: Products fetched successfully
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
 *                   example: Products fetched successfully
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64f123abc456
 *                       name:
 *                         type: string
 *                         example: iPhone 14
 *                       description:
 *                         type: string
 *                         example: Latest Apple smartphone
 *                       category:
 *                         type: string
 *                         example: Electronics
 *                       price:
 *                         type: number
 *                         example: 79999
 *                 error:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Search keyword is required
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
 *                   example: Search keyword is required
 *                 data:
 *                   type: null
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
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
 *                   example: Unauthorized access
 *                 data:
 *                   type: null
 *                 error:
 *                   type: string
 *                   example: Invalid or missing token
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
 *                   example: Internal server error
 *                 data:
 *                   type: null
 *                 error:
 *                   type: string
 *                   example: Something went wrong
 */
router.get("/searchProducts", verifyToken, productController.searchProduct);

//Filter_Product
/**
 * @swagger
 * /api/products/filter:
 *   get:
 *     summary: Filter products
 *     description: Filter products by category, brand, and price range. Requires JWT authentication.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter products by category
 *       - in: query
 *         name: brand
 *         schema:
 *           type: string
 *         description: Filter products by brand
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum product price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum product price
 *     responses:
 *       200:
 *         description: Products filtered successfully
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
 *                   example: Product filter successfully
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64f123abc456
 *                       name:
 *                         type: string
 *                         example: iPhone 14
 *                       category:
 *                         type: string
 *                         example: Electronics
 *                       brand:
 *                         type: string
 *                         example: Apple
 *                       price:
 *                         type: number
 *                         example: 79999
 *                 error:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Invalid filter parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/filter", verifyToken, productController.filterProducts);

//update status
/**
 * @swagger
 * /api/products/{id}/status:
 *   patch:
 *     summary: Update product status
 *     description: Update the status of a product. Only admin users can perform this action.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - active
 *                   - inactive
 *                   - out of stock
 *                   - discontinued
 *                 example: active
 *     responses:
 *       200:
 *         description: Product status updated successfully
 *       400:
 *         description: Invalid product status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.patch(
  "/:id/status",
  verifyToken,
  isAdmin,
  productController.productStatus,
);
module.exports = router;
