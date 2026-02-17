/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist Management APIs
 */

const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const verifyToken = require("../middlewares/verifyToken");
const notAnAdmin = require("../middlewares/notAnAdmin");

//Add_to_wishlist
/**
 * @swagger
 * /api/wishlist/add:
 *   post:
 *     summary: Add product to wishlist
 *     description: Add a product to the user's wishlist. Requires JWT authentication.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64prod123456
 *     responses:
 *       201:
 *         description: Product added to wishlist
 *       409:
 *         description: Product already in wishlist
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */

router.post("/add", verifyToken, notAnAdmin, wishlistController.addToWishlist);

//Get_wishlist
/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Get user wishlist
 *     description: Fetch the logged-in user's wishlist with product details. Requires JWT authentication.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist fetched successfully
 *       500:
 *         description: Server error
 */

router.get("/", verifyToken, notAnAdmin, wishlistController.getWishlist);

//Remove_item_from_wishlist
/**
 * @swagger
 * /api/wishlist/remove/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     description: Remove a specific product from the logged-in user's wishlist. Requires JWT authentication.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove from wishlist
 *     responses:
 *       200:
 *         description: Product removed from wishlist successfully
 *       404:
 *         description: Product not found in wishlist
 *       500:
 *         description: Server error
 */

router.delete(
  "/remove/:productId",
  verifyToken,
  notAnAdmin,
  wishlistController.removeItem,
);

module.exports = router;
