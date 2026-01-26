/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart Management APIs
 */

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const verifyToken = require("../middlewares/verifyToken");
const notAnAdmin = require("../middlewares/notAnAdmin");

//Cart_API

//Add_to_cart
/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add product to cart
 *     description: Add a product to the user's cart. If the cart does not exist, it will be created. Requires JWT authentication.
 *     tags:
 *       - Cart
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
 *                 example: 64fab123456
 *               quantity:
 *                 type: integer
 *                 example: 2
 *                 default: 1
 *     responses:
 *       201:
 *         description: Product added to cart
 *       200:
 *         description: Cart updated successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/add", verifyToken, notAnAdmin, cartController.addToCart);

//Get_cart_items
/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user cart
 *     description: Fetch the current logged-in user's cart. Requires JWT authentication.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Server error
 */
router.get("/", verifyToken, notAnAdmin, cartController.getCart);

//Update_cart
/**
 * @swagger
 * /api/cart/update:
 *   put:
 *     summary: Update cart item quantity
 *     description: Update the quantity of a product in the user's cart. Requires JWT authentication.
 *     tags:
 *       - Cart
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
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64prod123456
 *               quantity:
 *                 type: integer
 *                 example: 1
 *                 description: Quantity to increase or decrease
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put("/update", verifyToken, notAnAdmin, cartController.updateCart);

//Delete_cart_item
/**
 * @swagger
 * /api/cart/remove/{productId}:
 *   delete:
 *     summary: Remove product from cart
 *     description: Remove a specific product from the logged-in user's cart. Requires JWT authentication.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID to remove from cart
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found in cart
 *       500:
 *         description: Server error
 */
router.delete(
  "/remove/:productId",
  verifyToken,
  notAnAdmin,
  cartController.removeProduct,
);

module.exports = router;
