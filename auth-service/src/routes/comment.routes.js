/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment Management APIs
 */

const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const commentController = require("../controllers/comment.controller");

// Add comment
/**
 * @swagger
 * /api/comment/add:
 *   post:
 *     summary: Add product comment
 *     description: Add a comment to a product. Requires JWT authentication.
 *     tags:
 *       - Comments
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
 *               - text
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 64prod123456
 *               text:
 *                 type: string
 *                 example: This product looks really good!
 *     responses:
 *       201:
 *         description: Comment added successfully
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
 *                   example: Comment added successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64comment123456
 *                     user:
 *                       type: string
 *                       example: 64user123456
 *                     product:
 *                       type: string
 *                       example: 64prod123456
 *                     text:
 *                       type: string
 *                       example: This product looks really good!
 *                     createdAt:
 *                       type: string
 *                       example: 2025-01-22T10:30:00Z
 *                 error:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Comment text is required
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
 *                   example: Comment text is required
 *                 data:
 *                   type: null
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to add comment
 */
router.post("/add", verifyToken, commentController.addComment);

// Get comments by product
/**
 * @swagger
 * /api/comment/product/{productId}:
 *   get:
 *     summary: Get product comments
 *     description: Fetch all comments for a specific product. Requires JWT authentication.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Comments fetched successfully
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
 *                   example: Comments fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64comment123456
 *                       text:
 *                         type: string
 *                         example: Amazing product!
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 64user123456
 *                           name:
 *                             type: string
 *                             example: John Doe
 *                       createdAt:
 *                         type: string
 *                         example: 2025-01-22T10:30:00Z
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to fetch comments
 */
router.get(
  "/product/:productId",
  verifyToken,
  commentController.getProductComment,
);

// Delete comment
/**
 * @swagger
 * /api/comment/{commentId}:
 *   delete:
 *     summary: Delete comment
 *     description: Delete a comment created by the logged-in user. Requires JWT authentication.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Comment ID
 *     responses:
 *       200:
 *         description: Comment deleted successfully
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
 *                   example: Comment deleted successfully
 *                 data:
 *                   type: null
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not authorized to delete this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Failed to delete comment
 */

router.delete("/:commentId", verifyToken, commentController.deleteComment);

module.exports = router;
