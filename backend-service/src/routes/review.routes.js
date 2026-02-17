/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Reviews Management APIs
 */

const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const verifyToken = require("../middlewares/verifyToken");
const notAnAdmin = require("../middlewares/notAnAdmin");

//Add_review
/**
 * @swagger
 * /api/review/add:
 *   post:
 *     summary: Add product review
 *     description: Add a review and rating for a product. Each user can review a product only once. User access only.
 *     tags:
 *       - Reviews
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
 *               - rating
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64prod123456
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Excellent product, very good quality!
 *     responses:
 *       201:
 *         description: Review added successfully
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
 *                   example: Your review added successfully
 *                 review:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64review123456
 *                     user:
 *                       type: string
 *                       example: 64user123456
 *                     product:
 *                       type: string
 *                       example: 64prod123456
 *                     rating:
 *                       type: integer
 *                       example: 5
 *                     comment:
 *                       type: string
 *                       example: Excellent product, very good quality!
 *                 error:
 *                   type: string
 *                   example: null
 *       409:
 *         description: User already reviewed this product
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
 *                   example: You have already reviewed this product
 *                 data:
 *                   type: null
 *                 error:
 *                   type: string
 *                   example: null
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin not allowed
 *       500:
 *         description: Failed to add review
 */

router.post("/add", verifyToken, notAnAdmin, reviewController.addReview);

//Remove_review
/**
 * @swagger
 * /api/review/{productId}:
 *   delete:
 *     summary: Remove product review
 *     description: Remove the logged-in user's review for a specific product. User access only.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID whose review needs to be removed
 *     responses:
 *       200:
 *         description: Review deleted successfully
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
 *                   example: Review deleted successfully
 *                 data:
 *                   type: null
 *                 error:
 *                   type: string
 *                   example: null
 *       404:
 *         description: Review or product not found
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
 *                   example: You have not reviewed this product yet
 *                 data:
 *                   type: null
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin not allowed
 *       500:
 *         description: Failed to delete review
 */

router.delete(
  "/:productId",
  verifyToken,
  notAnAdmin,
  reviewController.removeReview,
);

module.exports = router;
