/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Posts Management APIs
 */
const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const notAnAdmin = require("../middlewares/notAnAdmin");
const upload = require("../middlewares/upload");
const PostController = require("../controllers/post.controller");

//create_Post
/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     description: Create a post with images and a tagged product. Requires JWT authentication.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - images
 *               - taggedProductId
 *             properties:
 *               caption:
 *                 type: string
 *                 example: Loving this product!
 *               taggedProductId:
 *                 type: string
 *                 example: 64prod123456
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Upload up to 5 images
 *     responses:
 *       201:
 *         description: Post created successfully
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
 *                   example: Post created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64post123456
 *                     user:
 *                       type: string
 *                       example: 64user123456
 *                     caption:
 *                       type: string
 *                       example: Loving this product!
 *                     imageUrl:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: /uploads/image1.jpg
 *                     taggedProduct:
 *                       type: string
 *                       example: 64prod123456
 *                     createdAt:
 *                       type: string
 *                       example: 2025-01-22T12:30:00Z
 *                 error:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Validation error (images or product missing)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin not allowed
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to create post
 */

router.post(
  "/",
  verifyToken,
  notAnAdmin,
  upload.array("images", 5),
  PostController.createPost,
);

//get_posts
/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: Get all posts (feed)
 *     description: Fetch all active posts excluding the logged-in user's posts. Requires JWT authentication.
 *     tags:
 *       - Posts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Posts fetched successfully
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
 *                   example: Posts fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64post123456
 *                       caption:
 *                         type: string
 *                         example: Check out this amazing product!
 *                       imageUrl:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: /uploads/post1.jpg
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 64user123456
 *                           name:
 *                             type: string
 *                             example: John Doe
 *                       taggedProduct:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 64prod123456
 *                           productName:
 *                             type: string
 *                             example: iPhone 14
 *                           price:
 *                             type: number
 *                             example: 79999
 *                           productImage:
 *                             type: string
 *                             example: iphone.jpg
 *                       createdAt:
 *                         type: string
 *                         example: 2025-01-24T10:30:00Z
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch posts
 */

router.get("/", verifyToken, PostController.getPosts);

module.exports = router;
