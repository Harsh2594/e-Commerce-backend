const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const userController = require("../controllers/user.controller");

//change_password
/**
 * @swagger
 * /api/users/changePassword:
 *   put:
 *     summary: Change user password
 *     tags: [Users Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: oldPass@123
 *               newPassword:
 *                 type: string
 *                 example: newPass@456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid old password
 */

router.put("/changePassword", verifyToken, userController.changePassword);

//get_user_profile
/**
 * @swagger
 * /api/users/User-Profile:
 *   get:
 *     summary: Get User detail
 *     tags: [Users Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully changed
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               address:
 *                 type: string
 *               role:
 *                 type: string
 *       401:
 *         description: Unauthorized or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get("/User-Profile", verifyToken, userController.getProfile);

//update_Profile
/**
 * @swagger
 * /api/users/update-profile/{id}:
 *   put:
 *     summary: Update User profile
 *     tags: [Users Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: harsh
 *               phoneNumber:
 *                 type: string
 *                 example: 9898989898
 *               address:
 *                 type: string
 *                 example: Kanpur Nagar
 *     responses:
 *       200:
 *         description: User profile updated successfully changed
 *         content:
 *           application/json:
 *             schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Profile updated successfully
 *       400:
 *         description: No valid fields to update
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.put("/update-profile/:id", verifyToken, userController.updateProfile);

module.exports = router;
