/**
 * @swagger
 * tags:
 *   name: Admin Orders
 *   description: Admin Order Management APIs
 */

const express = require("express");
const router = express.Router();
const adminOrderController = require("../controllers/adminOrder.controller");
const verifyToken = require("../middlewares/verifyToken");
const isAdmin = require("../middlewares/isAdmin");

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (Admin)
 *     description: Fetch all orders in the system. Admin access only.
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Orders fetched successfully
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
 *                   example: orders found
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64order123456
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 64user123456
 *                           name:
 *                             type: string
 *                             example: John Doe
 *                           email:
 *                             type: string
 *                             example: john@example.com
 *                       items:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             product:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: 64prod123456
 *                                 name:
 *                                   type: string
 *                                   example: iPhone 14
 *                                 price:
 *                                   type: number
 *                                   example: 79999
 *                             quantity:
 *                               type: integer
 *                               example: 1
 *                             price:
 *                               type: number
 *                               example: 79999
 *                       totalAmount:
 *                         type: number
 *                         example: 79999
 *                       paymentMethod:
 *                         type: string
 *                         example: COD
 *                       paymentStatus:
 *                         type: string
 *                         example: pending
 *                       status:
 *                         type: string
 *                         example: pending
 *                       createdAt:
 *                         type: string
 *                         example: 2025-01-21T10:30:00Z
 *                 error:
 *                   type: string
 *                   example: null
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */

router.get("/orders", verifyToken, isAdmin, adminOrderController.getAllOrders);

/**
 * @swagger
 * /api/admin/orders/{orderId}/status:
 *   put:
 *     summary: Update order status (Admin)
 *     description: Update the status of an order. Admin access only.
 *     tags:
 *       - Admin Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderStatus
 *             properties:
 *               orderStatus:
 *                 type: string
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated successfully
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
 *                   example: Order status updated
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64order123456
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: John Doe
 *                         email:
 *                           type: string
 *                           example: john@example.com
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           product:
 *                             type: object
 *                             properties:
 *                               productName:
 *                                 type: string
 *                                 example: iPhone 14
 *                               price:
 *                                 type: number
 *                                 example: 79999
 *                           quantity:
 *                             type: integer
 *                             example: 1
 *                     orderStatus:
 *                       type: string
 *                       example: shipped
 *                 error:
 *                   type: string
 *                   example: null
 *       400:
 *         description: Invalid order status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */

router.put(
  "/orders/:orderId/status",
  verifyToken,
  isAdmin,
  adminOrderController.changeOrderStatus,
);

module.exports = router;
