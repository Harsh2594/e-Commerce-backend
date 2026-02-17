/**
 * @swagger
 * tags:
 *   name: Follow
 *   description: Follow Management APIs
 */

const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const followController = require("../controllers/follow.controller");

/**
 * @swagger
 * /api/follow/{followingId}:
 *   post:
 *     summary: Follow or unfollow a user
 *     description: Follow or unfollow a user. If already following, the user will be unfollowed. Requires JWT authentication.
 *     tags:
 *       - Follow
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: followingId
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to follow or unfollow
 *     responses:
 *       200:
 *         description: Follow or unfollow action successful
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
 *                   example: User followed
 *                 data:
 *                   type: null
 *                 error:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Cannot follow yourself
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
 *                   example: Can not follow yourself
 *                 data:
 *                   type: null
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to follow or unfollow
 */
router.post("/:followingId", verifyToken, followController.clickFollow);

module.exports = router;
